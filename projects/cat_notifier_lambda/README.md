# 🐾 PawsCat City – New Kitten Notifier (Python + AWS Lambda)

A tiny Python service that checks PawsCat City for new kitten listings and sends me an email alert.
Deployed on AWS Lambda and triggered by Amazon EventBridge on a schedule.

---

## 📦 How to Run (Lambda or Local)

### 1. Clone

```bash
git clone <your-repo-url>

cd cat_notifier_lambda
```

---

## 💻 Run Locally (Python)

### Prerequisites

- Python 3.10+
- pip install -r requirements.txt (uses: requests, beautifulsoup4, boto3)

### Environment Variables

```bash
export SHELTER_URL="https://example.org/new-kittens"
export EMAIL_FROM="alerts@example.com"      # SES verified sender
export EMAIL_TO="you@example.com"
export AWS_REGION="us-west-2"
```

### Run

```bash
python -c "from lambda_function import lambda_handler; print(lambda_handler({}, {}))"
```

---

## Deploy to AWS (Lambda + EventBridge + SES)

### 1. Lambda

- Runtime: Python 3.11 (or 3.10)
- Handler: ```lambda_function.lambda_handler```
- Upload zipped code and set the env vars above

### 2. SES

- Verify ```EMAIL_FROM``` (and ```EMAIL_TO``` if SES sandbox)

### 3. Schedule

- EventBridge rule: ```rate(30 minutes)``` (or your cron)
- Target: your Lambda function

EventBridge triggers the Lambda; Lambda sends email via Amazon SES.

---

## 🔑 Environment Variables

| Name           | Required | Example                  | Description            |
|----------------|----------|--------------------------|------------------------|
| `SHELTER_URL`  | ✅       | `https://…/new-kittens`  | Shelter page to check  |
| `EMAIL_FROM`   | ✅       | `alerts@example.com`     | SES verified sender    |
| `EMAIL_TO`     | ✅       | `you@example.com`        | Recipient of alerts    |
| `AWS_REGION`   | ✅       | `us-west-2`              | Region for Lambda/SES  |

---

## 🗂️ Features

- Scheduled checks with EventBridge
- Scrapes the shelter page for new kittens
- Sends concise email with names + links
- Lightweight and low-cost (serverless)

---

## 🔧 Tech Stack

| Part    | Tech                     |
| ------- | ------------------------ |
| Runtime | AWS Lambda (Python)      |
| Trigger | Amazon EventBridge       |
| Email   | Amazon SES (boto3)       |
| Parsing | requests + BeautifulSoup |

---

## 📁 Project Structure

```bash

.
├─ lambda_function.py    # fetch + parse + email
└─ README.md

```

---

## 🧠 Notes
- If you need persistence to avoid duplicate alerts, store seen IDs in S3 or DynamoDB.
- Check CloudWatch Logs if emails don’t arrive (SES verification, sandbox, region).

---

## ✍️ Author

- **Xinyu Wu**

---