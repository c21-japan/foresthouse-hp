<?php
// ========================================
// 無料査定フォーム送信処理
// ロリポップ用
// ========================================

header('Content-Type: application/json; charset=utf-8');

// POSTデータの取得
$property_type = isset($_POST['property_type']) ? htmlspecialchars($_POST['property_type'], ENT_QUOTES, 'UTF-8') : '';
$prefecture = isset($_POST['prefecture']) ? htmlspecialchars($_POST['prefecture'], ENT_QUOTES, 'UTF-8') : '';
$city = isset($_POST['city']) ? htmlspecialchars($_POST['city'], ENT_QUOTES, 'UTF-8') : '';
$address = isset($_POST['address']) ? htmlspecialchars($_POST['address'], ENT_QUOTES, 'UTF-8') : '';
$mansion_name = isset($_POST['mansion_name']) ? htmlspecialchars($_POST['mansion_name'], ENT_QUOTES, 'UTF-8') : '';
$area = isset($_POST['area']) ? htmlspecialchars($_POST['area'], ENT_QUOTES, 'UTF-8') : '';
$layout = isset($_POST['layout']) ? htmlspecialchars($_POST['layout'], ENT_QUOTES, 'UTF-8') : '';
$building_age = isset($_POST['building_age']) ? htmlspecialchars($_POST['building_age'], ENT_QUOTES, 'UTF-8') : '';
$current_status = isset($_POST['current_status']) ? htmlspecialchars($_POST['current_status'], ENT_QUOTES, 'UTF-8') : '';
$name = isset($_POST['name']) ? htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8') : '';
$tel = isset($_POST['tel']) ? htmlspecialchars($_POST['tel'], ENT_QUOTES, 'UTF-8') : '';
$email = isset($_POST['email']) ? htmlspecialchars($_POST['email'], ENT_QUOTES, 'UTF-8') : '';
$assessment_type = isset($_POST['assessment_type']) ? htmlspecialchars($_POST['assessment_type'], ENT_QUOTES, 'UTF-8') : '訪問査定';
$message = isset($_POST['message']) ? htmlspecialchars($_POST['message'], ENT_QUOTES, 'UTF-8') : '';

// 必須項目のチェック
if (empty($property_type) || empty($prefecture) || empty($city) || empty($name) || empty($tel) || empty($email)) {
    echo json_encode([
        'success' => false,
        'message' => '必須項目が入力されていません。'
    ]);
    exit;
}

// メールアドレスのバリデーション
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => '正しいメールアドレスを入力してください。'
    ]);
    exit;
}

// メール送信先
$to = 'support@century21.group';
$subject = 'フォレストハウスHPからの問い合わせ';

// メール本文の作成
$body = "以下の内容で無料査定のお申し込みがありました。\n\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$body .= "【物件情報】\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$body .= "物件種別: " . $property_type . "\n";
$body .= "物件所在地: " . $prefecture . " " . $city;
if (!empty($address)) {
    $body .= " " . $address;
}
$body .= "\n";
if (!empty($mansion_name)) {
    $body .= "マンション名: " . $mansion_name . "\n";
}
if (!empty($area)) {
    $body .= "専有面積: " . $area . "㎡\n";
}
if (!empty($layout)) {
    $body .= "間取り: " . $layout . "\n";
}
if (!empty($building_age)) {
    $body .= "築年数: " . $building_age . "年\n";
}
if (!empty($current_status)) {
    $body .= "現在の状況: " . $current_status . "\n";
}
$body .= "\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$body .= "【お客様情報】\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$body .= "お名前: " . $name . "\n";
$body .= "電話番号: " . $tel . "\n";
$body .= "メールアドレス: " . $email . "\n";
$body .= "査定方法: " . $assessment_type . "\n";
if (!empty($message)) {
    $body .= "\n【ご要望・ご質問】\n" . $message . "\n";
}
$body .= "\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$body .= "送信日時: " . date('Y年m月d日 H:i:s') . "\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

// メールヘッダーの設定（ロリポップ用）
$headers = "From: " . mb_encode_mimeheader($name, 'UTF-8') . " <" . $email . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// ロリポップのmb_send_mailは件名を自動エンコードするため、直接日本語を渡す
// メール送信
$success = mb_send_mail($to, $subject, $body, $headers);

if ($success) {
    echo json_encode([
        'success' => true,
        'message' => '送信が完了しました。'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'メール送信に失敗しました。'
    ]);
}
?>
