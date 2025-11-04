import os
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://joingame.azurewebsites.net"

def get_course_links(headers):
    response = requests.get(f"{BASE_URL}/Games", headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")
    links = soup.select("a[href*='/Games/Details?id=']")
    course_urls = [BASE_URL + link["href"] for link in links]
    return list(dict.fromkeys(course_urls))[:2]  # 去重 + 前2门课

def sign_up(course_url, headers):
    response = requests.get(course_url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")
    
    signup_button = soup.find("button", string="Sign Up")
    if signup_button:
        # TODO: 如果系统需要 POST 提交报名，我们可以进一步模拟提交
        print(f"✅ 检测到报名按钮: {course_url}")
        # 示例：requests.post(course_url, headers=headers, data=...)
    else:
        print(f"❌ 报名按钮不存在: {course_url}")

def lambda_handler(event, context):
    cookie = os.environ["COOKIE"]
    headers = {
        "Cookie": cookie,
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/119.0.0.0 Safari/537.36"
        )
    }

    print("🚀 正在获取课程列表...")
    course_links = get_course_links(headers)
    print("🎯 找到课程链接：", course_links)

    for link in course_links:
        sign_up(link, headers)

    return {"status": "done"}
