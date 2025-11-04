# 🏐 Volleyball Auto Sign-Up Bot (Python + AWS Lambda)

A tiny Python Lambda that submits the volleyball class sign-up form right when registration opens, so I stop missing spots.
Deployed on **AWS** Lambda and triggered by **Amazon EventBridge** on a schedule.

---

## 📦 How to Run (Lambda or Local)

### 1. Clone

```bash
git clone <your-repo-url>

cd VolleyballClassSignUp
```

---

## 💻 Run Locally (Python)

### Prerequisites

- Python 3.10+
- pip install -r requirements.txt (uses: requests, beautifulsoup4; optional: playwright)

### Environment Variables

```bash
export SIGNUP_URL="https://example.org/classes/signup"
export NAME="Your Name"
export EMAIL="you@example.com"
export CLASS_ID="abc123"             # class/session identifier required by the form
export EXTRA_FORM_JSON='{"phone":"123-456-7890"}'   # optional extra fields/hidden inputs
export USER_AGENT="Mozilla/5.0"      # optional
export DRY_RUN="false"               # set to true to log payload without submitting
```

### Run

```bash
python -c "from lambda_function import lambda_handler; print(lambda_handler({}, {}))"
```

---

## Deploy to AWS (Lambda + EventBridge)

### 1. Lambda

- Runtime: Python 3.11 (or 3.10)
- Handler: ```lambda_function.lambda_handler```
- Upload zipped code and set the env vars above

### 2. Schedule

- In EventBridge → Rules, create a schedule for your target time
    - Example (every Tue 6:59 PM PT): ```cron(59 18 ? * TUE *)```
- Target: your Lambda function

EventBridge triggers the Lambda exactly at your chosen time; the Lambda posts the form to ```SIGNUP_URL```.

---

## 🔑 Environment Variables

| Name              | Required | Example                    | Description                            |
| ----------------- | -------- | -------------------------- | -------------------------------------- |
| `SIGNUP_URL`      | ✅        | `https://…/classes/signup` | Form endpoint (final action URL)       |
| `NAME`            | ✅        | `Lesley Wu`                | Form field for your name               |
| `EMAIL`           | ✅        | `you@example.com`          | Form field for your email              |
| `CLASS_ID`        | ✅        | `abc123`                   | Class/session identifier parameter     |
| `EXTRA_FORM_JSON` | ❌        | `{"phone":"123-456-7890"}` | Any additional/hidden fields as JSON   |
| `USER_AGENT`      | ❌        | `Mozilla/5.0`              | Custom UA header if the site checks it |
| `DRY_RUN`         | ❌        | `true` / `false`           | Log payload only, do not submit        |


---

## 🗂️ Features

- Fires exactly at sign-up time via EventBridge
- Submits the registration form with predefined data
- Optional dry-run mode to test without posting
- Lightweight, serverless, low-cost

---

## 🔧 Tech Stack

| Part     | Tech                          |
| -------- | ----------------------------- |
| Runtime  | AWS Lambda (Python)           |
| Trigger  | Amazon EventBridge            |
| HTTP     | `requests` (+ BS4 if needed)  |
| Optional | Playwright for JS-heavy pages |

---

## 📁 Project Structure

```bash

.
├─ lambda_function.py    # build payload, (optionally fetch page), submit form
├─ requirements.txt
└─ README.md

```

---

## 🧠 Notes
- Some sites require CSRF tokens/cookies. If so, fetch the page first, parse the token, and include it in ```EXTRA_FORM_JSON```.
- Respect the site’s Terms of Service and rate limits. Use **DRY_RUN** to validate before the real window.
- If the page relies heavily on client-side JS, consider a Playwright build for Lambda.

---

## ✍️ Author

- **Xinyu Wu**

---