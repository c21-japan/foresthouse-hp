// Vercel Functions - 査定フォーム送信API
// SendGridを使用してメール送信

export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const {
      property_type,
      prefecture,
      city,
      address,
      mansion_name,
      area,
      layout,
      building_age,
      current_status,
      name,
      tel,
      email,
      assessment_type,
      message
    } = req.body;

    // 必須項目のチェック
    if (!property_type || !prefecture || !city || !name || !tel || !email) {
      return res.status(400).json({
        success: false,
        message: '必須項目が入力されていません。'
      });
    }

    // メールアドレスのバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '正しいメールアドレスを入力してください。'
      });
    }

    // メール本文の作成
    let emailBody = '以下の内容で無料査定のお申し込みがありました。\n\n';
    emailBody += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    emailBody += '【物件情報】\n';
    emailBody += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    emailBody += `物件種別: ${property_type}\n`;
    emailBody += `物件所在地: ${prefecture} ${city}`;
    if (address) {
      emailBody += ` ${address}`;
    }
    emailBody += '\n';
    if (mansion_name) {
      emailBody += `マンション名: ${mansion_name}\n`;
    }
    if (area) {
      emailBody += `専有面積: ${area}㎡\n`;
    }
    if (layout) {
      emailBody += `間取り: ${layout}\n`;
    }
    if (building_age) {
      emailBody += `築年数: ${building_age}年\n`;
    }
    if (current_status) {
      emailBody += `現在の状況: ${current_status}\n`;
    }
    emailBody += '\n';
    emailBody += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    emailBody += '【お客様情報】\n';
    emailBody += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    emailBody += `お名前: ${name}\n`;
    emailBody += `電話番号: ${tel}\n`;
    emailBody += `メールアドレス: ${email}\n`;
    emailBody += `査定方法: ${assessment_type || '訪問査定'}\n`;
    if (message) {
      emailBody += '\n【ご要望・ご質問】\n' + message + '\n';
    }
    emailBody += '\n';
    emailBody += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    emailBody += `送信日時: ${new Date().toLocaleString('ja-JP')}\n`;
    emailBody += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';

    // SendGridでメール送信
    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    const sendGridFromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com';

    if (!sendGridApiKey) {
      // SendGridのAPIキーが設定されていない場合、フォールバック処理
      // ここではログ出力のみ（本番環境ではSendGridの設定が必要）
      console.log('メール送信（SendGrid未設定）:', {
        to: 'support@century21.group',
        subject: 'フォレストハウスHPからの問い合わせ',
        body: emailBody
      });

      // 開発環境では成功として返す（実際のメール送信は設定後に有効化）
      return res.status(200).json({
        success: true,
        message: '送信が完了しました。'
      });
    }

    // SendGrid APIを使用してメール送信
    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendGridApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: 'support@century21.group' }],
          subject: 'フォレストハウスHPからの問い合わせ'
        }],
        from: { email: sendGridFromEmail, name: name },
        reply_to: { email: email },
        content: [{
          type: 'text/plain',
          value: emailBody
        }]
      })
    });

    if (!sendGridResponse.ok) {
      const errorText = await sendGridResponse.text();
      console.error('SendGrid Error:', errorText);
      return res.status(500).json({
        success: false,
        message: 'メール送信に失敗しました。'
      });
    }

    return res.status(200).json({
      success: true,
      message: '送信が完了しました。'
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました。'
    });
  }
}
