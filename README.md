# DDoS Monitoring Dashboard on AWS

A cloud-based **DDoS monitoring and protection system** designed to detect, log, and analyze suspicious traffic targeting web applications.  
The system is built using **Node.js**, **Express.js**, **MySQL**, and deployed on **AWS** with scalable and secure cloud infrastructure.

---

## 📌 Project Overview

Distributed Denial of Service (DDoS) attacks are one of the most common threats to cloud-hosted applications.  
This project implements a **monitoring-focused DDoS protection architecture** that logs potential attack traffic, stores it persistently, and presents it through a simple dashboard interface.

The system is designed to be **modular, scalable, and cloud-native**, making it suitable for academic as well as real-world learning purposes.

---

## 🚀 Features

- Real-time logging of suspicious requests  
- Backend APIs for inserting and retrieving DDoS logs  
- MySQL database for persistent storage  
- Cloud deployment using AWS EC2 and RDS  
- Designed for integration with AWS WAF and CloudFront  
- Modular architecture for future scalability  

---

## 🛠️ Tech Stack

### Backend
- Node.js  
- Express.js  
- MySQL  

### Cloud & Infrastructure
- AWS EC2 (backend hosting)  
- AWS RDS (MySQL database)  
- AWS WAF (DDoS rule-based filtering – optional)  
- AWS CloudFront (CDN & traffic distribution – optional)

### Tools
- Git & GitHub  
- VS Code  
- Postman (API testing)

---

## 🏗️ System Architecture

1. Incoming traffic reaches the cloud infrastructure  
2. Requests are monitored and filtered using security rules  
3. Suspicious activity is logged via backend APIs  
4. Logs are stored in a MySQL database (RDS)  
5. Data can be retrieved and displayed on a dashboard  

---

## 📂 Project Structure

