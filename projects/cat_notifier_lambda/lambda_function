import os
import json
import requests
from bs4 import BeautifulSoup
import smtplib
from email.mime.text import MIMEText

URL = "https://www.paws.org/adopt/cats/"

def fetch_cats():
    response = requests.get(URL)
    soup = BeautifulSoup(response.text, 'html.parser')
    cat_cards = soup.select(".pet-card")

    cats = []
    for card in cat_cards:
        name = card.select_one(".pet-card__name").get_text(strip=True)
        link = card.select_one("a")["href"]
        full_link = "https://www.paws.org" + link
        cats.append({"name": name, "url": full_link})
    return cats

def get_new_cats(old, new):
    old_names = {c["name"] for c in old}
    return [cat for cat in new if cat["name"] not in old_names]

def send_email(new_cats):
    sender = os.environ["EMAIL_SENDER"]
    password = os.environ["EMAIL_PASSWORD"]
    receiver = os.environ["EMAIL_RECEIVER"]

    body = "\n\n".join([f"{c['name']}: {c['url']}" for c in new_cats])
    msg = MIMEText(f"发现新猫咪可以领养啦！\n\n{body}", _charset="utf-8")
    msg["Subject"] = "🐱 PAWS 有新猫咪上架啦！"
    msg["From"] = sender
    msg["To"] = receiver

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(sender, password)
        smtp.send_message(msg)
        print("📧 邮件已发送")

def lambda_handler(event, context):
    current = fetch_cats()

    # 上次的猫咪名字存在环境变量中
    old_raw = os.environ.get("CATS_SEEN", "[]")
    try:
        previous = json.loads(old_raw)
    except:
        previous = []

    new_cats = get_new_cats(previous, current)

    if new_cats:
        print(f"🎉 有 {len(new_cats)} 只新猫！")
        send_email(new_cats)
        # 👇 把本次猫咪名字回写为环境变量（给下次用）
        # ❗注意：Lambda 运行间环境变量不可写入，若需持久保存请改用 S3 或 DynamoDB
        # 可以手动复制打印结果
        print("❗请更新环境变量 CATS_SEEN 为：")
        print(json.dumps(current))
    else:
        print("😿 今天没有新猫咪...")
