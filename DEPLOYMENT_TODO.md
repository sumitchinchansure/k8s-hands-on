# Public Deployment TODO

## Quick Action Items for Public Deployment

### Option 1: AWS Lightsail Container Service ($7/month)
- [ ] Register domain name or configure existing domain
- [ ] Create Lightsail container service
- [ ] Deploy frontend and backend containers from Docker Hub
- [ ] Configure custom domain and SSL certificate
- [ ] Set up environment variables (OpenAI API key)

### Option 2: Single EC2 + Docker Compose ($5/month)
- [ ] Launch t3.micro EC2 instance
- [ ] Install Docker and docker-compose
- [ ] Deploy app with docker-compose.yml
- [ ] Configure nginx reverse proxy with SSL
- [ ] Point domain DNS to EC2 public IP

### Option 3: AWS App Runner ($7-20/month)
- [ ] Create App Runner service from Docker Hub images
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Configure environment variables

### Domain & DNS (All Options)
- [ ] Purchase domain (~$12/year) or use existing
- [ ] Create Route 53 hosted zone
- [ ] Configure DNS records (A/CNAME)
- [ ] Verify SSL certificate

### Monitoring & Maintenance
- [ ] Set up basic monitoring
- [ ] Configure log aggregation
- [ ] Set up backup strategy
- [ ] Configure auto-scaling (if supported)

---
*Focus: Complete K8s, Terraform, CI/CD learning first, then return to public deployment*