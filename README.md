# AWS Serverless Contact Form

A serverless contact form backend using Lambda, API Gateway, and SNS — no servers 
running 24/7, unlike my EC2 project. Code only runs when someone actually submits 
the form.

## Live Demo
The form is embedded in my portfolio site: [http://muzi-portfolio-site.s3-website.af-south-1.amazonaws.com/test-form.html]

## Overview
Third project in my AWS learning series, built while studying for CLF-C02 and 
SAA-C03. This one demonstrates the serverless/event-driven pattern as a contrast 
to my EC2 project's always-on server model — a good example of the "EC2 vs 
Lambda" tradeoff that comes up constantly in the Solutions Architect exam.

## Architecture
Browser form → API Gateway (HTTP API) → Lambda function → SNS topic → Email notification

## AWS Services Used
- **AWS Lambda** (Node.js) – processes the form submission and triggers the notification
- **Amazon API Gateway** (HTTP API) – exposes the Lambda function via a public HTTPS endpoint
- **Amazon SNS** – publishes the message and delivers it to my email via subscription
- **IAM** – execution role granting the Lambda function permission to publish to SNS

## Region
`af-south-1` (Africa – Cape Town)

## What This Project Actually Taught Me
Getting the pieces built was the easy part — wiring them together correctly was 
where the real learning happened:

- **Region consistency matters.** Built the API Gateway in the wrong AWS region 
  by mistake (console defaults to N. Virginia) — it silently created a completely 
  separate, disconnected API. Fixed by rebuilding it in the correct region 
  alongside the Lambda function and SNS topic.
- **A configured API isn't automatically a connected one.** The setup wizard can 
  complete without actually attaching a trigger between API Gateway and Lambda — 
  checking the Lambda function's "Triggers" tab confirmed the two weren't linked, 
  even though both existed independently.
- **CORS preflight requests need somewhere to land.** With the route set to `ANY`, 
  the browser's CORS preflight (OPTIONS) request was being forwarded to the Lambda 
  function itself, which didn't know how to handle it. Narrowing the route to 
  `POST` let API Gateway handle the preflight automatically instead.

## Known Limitations (by design, for a learning project)
- CORS is currently set to allow all origins (`*`) — a production version would 
  restrict this to the specific site domain
- The Lambda execution role uses `AmazonSNSFullAccess` — a production version 
  would scope this down to `sns:Publish` on the specific topic only

## What's Next
Back to the S3 project to add CloudFront for HTTPS + faster delivery, and to 
integrate this contact form fully into that live site.
