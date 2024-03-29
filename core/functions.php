<?php

//////////////////////////
///// SYSTEM INSTALL /////
//////////////////////////

/**
 * Install
 */
function install($db, $users)
{
    //check admin user
    $dba = $db->prepare('SELECT * FROM demo_users WHERE id = :id AND login = :login');
    $dba->bindValue(':id', $users['admin']['id']);
    $dba->bindValue(':login', $users['admin']['login']);
    $dba->execute();
    $user = $dba->fetch();
    if (empty($user)) {
        //insert users list if admin user is not exists
        foreach($users as $user) {
            $dba = $db->prepare('DELETE FROM demo_users WHERE id = :id OR login = :login');
            $dba->bindValue(':id', $user['id']);
            $dba->bindValue(':login', $user['login']);
            $dba->execute();
    
            $dba = $db->prepare('INSERT INTO demo_users SET id = :id, login = :login, password = :password, name = :name, m_name = :m_name, l_name = :l_name');
            $dba->bindValue(':id', $user['id']);
            $dba->bindValue(':login', $user['login']);
            $dba->bindValue(':name', $user['name']);
            $dba->bindValue(':m_name', $user['m_name']);
            $dba->bindValue(':l_name', $user['l_name']);
            $dba->bindValue(':password', password_hash($user['password'], PASSWORD_BCRYPT));
            $dba->execute();
        }

        //create new system key
        $dbb = $db->prepare('DELETE FROM demo_settings WHERE name = \'key\'');
        $dbb->execute();
        $dbb = $db->prepare('INSERT INTO demo_settings SET name = \'key\', value = \'' . md5(date('Y-m-d H:i:s') . rand(0, 10000)) . '\'');
        $dbb->execute();
    }
}

function getSystemKey($db)
{
    $dba = $db->prepare('SELECT * FROM demo_settings WHERE name = \'key\'');
    $dba->execute();
    $key = $dba->fetch();
    if (!empty($key['value'])) {
        return $key['value'];
    }

    return '';
}

/**
 * Check config params
 */
function checkConfig($users)
{
    //config admin check
    if (empty($users['admin'])) {
        echo 'Ошибка конфига, отсутствует пользователь admin';
        die;
    }

    //config system user check
    if (empty($users['system-user'])) {
        echo 'Ошибка конфига, отсутствует пользователь system-user';
        die;
    }

    //check users required parameters
    foreach($users as $key => $user) {
        if (empty($user['id'])) {
            echo 'Ошибка конфига, отсутствует параметр id пользователя' . $key;
            die;
        }
        if (empty($user['login'])) {
            echo 'Ошибка конфига, отсутствует параметр login пользователя' . $key;
            die;
        }
        if (empty($user['password'])) {
            echo 'Ошибка конфига, отсутствует параметр password пользователя' . $key;
            die;
        }
        if (!isset($user['name'])) {
            echo 'Ошибка конфига, отсутствует параметр name пользователя' . $key;
            die;
        }
        if (!isset($user['m_name'])) {
            echo 'Ошибка конфига, отсутствует параметр m_name пользователя' . $key;
            die;
        }
        if (!isset($user['l_name'])) {
            echo 'Ошибка конфига, отсутствует параметр l_name пользователя' . $key;
            die;
        }
    }
}

///////////////////////////////
///// USER DATA FUNCTIONS /////
///////////////////////////////

/**
 * Authorization
 * 
 * @return bool
 */
function authorization($login, $password, $db): bool
{
    $dbq = $db->prepare('SELECT * FROM demo_users WHERE login = :login');
    $dbq->bindValue(':login', $login);
    $dbq->execute();
    $user = $dbq->fetch();

    if (!empty($user) && password_verify($password, $user['password'])) {
        $_SESSION['auth'] = true;
        $_SESSION['api_token'] = md5(rand(0, 100));
        return true;
    } else {
        return false;
    }
}

/**
 * Check user authorization
 * 
 * @return bool
 */
function checkAuthorization(): bool
{
    if (isset($_SESSION['auth'])) {
        return true;
    }
    return false;
}

/**
 * Check api authorization
 */
function checkApiAuthorization(): bool
{
    if (!empty($_SESSION['api_token'])) {
        return true;
    }
    return false;
}

/**
 * Handle 403 error
 */
function error403()
{
    header('Location: /403');
    die;
}

/**
 * Logout
 * 
 * @return void
 */
function logout(): void
{
    unset($_SESSION['auth']);
    unset($_SESSION['api_token']);
}

///////////////////////
////// OBJECTS ////////
///////////////////////

function getObjects($db)
{
    $dbq = $db->prepare('SELECT * FROM demo_objects');
    $dbq->execute();
    return $dbq->fetchAll();
}

/**
 * Prepare objects tree data
 * 
 * @param array $objectsList - array of objects (sql list)
 * @param int $parentId - id object
 * 
 * @return array
 */
function makeTreeArrayRecursive(&$objectsList, $parentId = 0)
{
    $treeArray = [];
    foreach ($objectsList as $key => $item) {
        if ($item['parent_id'] == $parentId) {
            if ($item['has_childs']) {
                $item['childs'] = makeTreeArrayRecursive($objectsList, $item['id']);
            }
            $treeArray[] = $item;
            unset($objectsList[$key]);
        }
    }
    return $treeArray;
}

/**
 * Render objects tree recursive
 * 
 * @param array $array - array of objects in tree present
 * @param int $parentId - id object
 * 
 * @return string
 */
function renderTreeRecursive($array, $parentId = 0)
{
    $str = '';
    foreach ($array as $item) {
        $str .= '<div class="object" id="' . $item['id'] . '">';
        if (!empty($item['childs'])) {
            $str .= ' <button title="Развернуть\свернуть дерево элементов" class="btn" onclick="toggleTreeElement(' . $item['id'] . ', this);">[+]</button>';
        }
        $str .= '<div><span class="title" onclick="ajaxLoadDescription(' . $item['id'] . ');">' . $item['title'] . '</span></div>';
        if ($item['parent_id'] != $parentId) {
            continue;
        }
        if (!empty($item['childs'])) {
            $str .= '<div class="invisible" id="invisible' . $item['id'] . '">' . renderTreeRecursive($item['childs'], $item['id']) . '</div>';
        }
        $str .= '</div>';
    }
    return $str;
}

/**
 * Delete objects recursive
 * @param int $id - id объекта
 * @param object $db - PDO
 * 
 * @return array
 */
function deleteRecursive($id, $db)
{
    $dbq = $db->prepare('DELETE FROM demo_objects WHERE id = :id');
    $dbq->bindValue(':id', $id);
    if ($dbq->execute()) {
        $isDeleted = true;
    }

    if (!empty($object)) {
        $dbq = $db->prepare('SELECT * FROM demo_objects WHERE parent_id = :id');
        $dbq->bindValue(':id', $id);
        $dbq->execute();
        $objects = $dbq->fetchAll();
        if (!empty($objects)) {
            foreach ($objects as $obj) {
                deleteRecursive($obj['id'], $db);
            }
        }
    }

    return $isDeleted;
}

/**
 * Update objects has_child status
 * 
 * @param int $id - id объекта
 * @param object $db - PDO
 * 
 * @return array
 */
function updateChildsStatus($id, $db)
{
    $dbq = $db->prepare('SELECT * FROM demo_objects WHERE parent_id = :id');
    $dbq->bindValue(':id', $id);
    $dbq->execute();
    $result = $dbq->fetch();
    if (!empty($result)) {
        $dbq = $db->prepare('UPDATE demo_objects SET has_childs = true WHERE id = :id');
        $dbq->bindValue(':id', $id);
        if ($dbq->execute()) {
            $result['success'] = true;
        } else {
            $result['success'] = false;
        }
    }
}

/**
 * Get object childs
 * 
 * @param int $id - id объекта
 * @param object $db - PDO
 * 
 * @return array
 */
function getChildsRecursive($id, $db)
{
    $idList = [];
    $dbq = $db->prepare('SELECT * FROM demo_objects WHERE parent_id = :id');
    $dbq->bindValue(':id', $id);
    $dbq->execute();
    $objects = $dbq->fetchAll();
    if (!empty($objects)) {
        foreach ($objects as $object) {
            $idList = array_merge($idList, getChildsRecursive($object['id'], $db));
            $idList[] = $object['id'];
        }
    }
    return $idList;
}

////////////////////
///// MESSAGES /////
////////////////////

/* 
 * Get counter of sended messages
 * 
 * @return string
 */
function getMessagesSendCounter($db) 
{
    $dbq = $db->prepare('SELECT value FROM demo_settings WHERE name=\'messages-send-counter\'');
    $dbq->execute();
    $dbq = $dbq->fetch();
    $counter = $dbq['value'];
    if ($counter > 99) {
        $counter = $counter;
    } else if ($counter > 9) {
        $counter = '0' . $counter;
    } else {
        $counter = '00' . $counter;
    }

    return $counter;
}

/* 
 * Get counter of recieved messages
 * 
 * @return string
 */
function getMessagesRecievedCounter($db) 
{
    $dbq = $db->prepare('SELECT value FROM demo_settings WHERE name=\'messages-recieved-counter\'');
    $dbq->execute();
    $dbq = $dbq->fetch();
    $counter = $dbq['value'];
    if ($counter > 99) {
        $counter = $counter;
    } else if ($counter > 9) {
        $counter = '0' . $counter;
    } else {
        $counter = '00' . $counter;
    }

    return $counter;
}