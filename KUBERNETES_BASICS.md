# Kubernetes Basics for Beginners

## What is Kubernetes?
Kubernetes (K8s) is like a **smart manager** for your applications. It automatically runs, scales, and manages your containerized applications across multiple servers.

Think of it as an **orchestrator** that:
- Decides which server runs your app
- Restarts your app if it crashes
- Scales your app up/down based on demand
- Handles networking between services
- Manages updates without downtime

## Kubernetes Architecture

### 🏢 The Big Picture: Master-Worker Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Master Node   │    │  Worker Node 1  │    │  Worker Node 2  │
│ (Control Plane) │◄──►│   (Data Plane)  │    │   (Data Plane)  │
│                 │    │                 │    │                 │
│   • API Server  │    │    • kubelet    │    │    • kubelet    │
│   • etcd        │    │    • kube-proxy │    │    • kube-proxy │
│   • Scheduler   │    │    • Pods       │    │    • Pods       │
│   • Controller  │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🧠 Control Plane (Master Node)
The **brain** of Kubernetes that makes all decisions:

- **API Server**: The front door - handles all requests (like when you run `kubectl`)
- **etcd**: The memory - stores all cluster information and configuration
- **Scheduler**: The matchmaker - decides which worker node runs each application
- **Controller Manager**: The supervisor - ensures everything runs as expected

### 💪 Data Plane (Worker Nodes)
The **muscles** that actually run your applications:

- **kubelet**: The node agent - talks to master and manages containers on this node
- **kube-proxy**: The network manager - handles network traffic between services
- **Container Runtime**: The engine - actually runs your containers (Docker, containerd, etc.)

## Core Kubernetes Objects

### 🏠 Pod - The Smallest Unit
- **What**: A wrapper around one or more containers
- **Why**: Containers in a pod share network and storage
- **Think of it**: Like a house where containers are roommates sharing utilities

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: web-server
    image: nginx:latest
```

### 🚀 Deployment - Managing Pods
- **What**: Manages multiple identical pods
- **Why**: Ensures desired number of pods are always running
- **Think of it**: Like a production manager ensuring enough workers are on the floor

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3  # Always keep 3 pods running
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web
        image: nginx:latest
```

### 🌐 Service - Network Access
- **What**: Provides stable network access to pods
- **Why**: Pods can die and be recreated with new IPs, services provide consistent access
- **Think of it**: Like a phone number that forwards calls to the right person

**Types of Services:**
- **ClusterIP**: Only accessible within cluster (default)
- **NodePort**: Accessible from outside via node IP:port
- **LoadBalancer**: Uses cloud provider's load balancer

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

### 💾 StatefulSet - For Stateful Apps
- **What**: Like Deployment but for apps that need persistent identity
- **Why**: Databases need consistent hostnames and storage
- **Think of it**: Like numbered parking spots - each pod gets a specific identity

### 🗂️ ConfigMap & Secret - Configuration
- **ConfigMap**: Stores non-sensitive configuration (environment variables, config files)
- **Secret**: Stores sensitive data (passwords, API keys, certificates)

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgres://localhost:5432"
  debug_mode: "false"
```

### 🎯 Ingress - Smart Routing
- **What**: Routes external traffic to services based on rules
- **Why**: One entry point can route to multiple services
- **Think of it**: Like a smart receptionist directing visitors to different departments

## Important Kubernetes Concepts

### 🏷️ Labels and Selectors
- **Labels**: Key-value pairs attached to objects (like name tags)
- **Selectors**: Query labels to find objects
- **Use**: Connect services to pods, group related resources

```yaml
metadata:
  labels:
    app: web-server
    version: v1.2.0
    tier: frontend
```

### 📦 Namespaces
- **What**: Virtual clusters within a cluster
- **Why**: Organize resources, provide isolation, manage access
- **Think of it**: Like different departments in a company

Common namespaces:
- `default`: Where resources go if no namespace specified
- `kube-system`: Kubernetes system components
- `kube-public`: Public resources available to all users

### 🔐 RBAC (Role-Based Access Control)
- **What**: Controls who can do what in your cluster
- **Components**: Users, Roles, and RoleBindings
- **Think of it**: Like office key cards with different access levels

## Essential kubectl Commands

### Basic Commands
```bash
# Get cluster information
kubectl cluster-info

# List all nodes
kubectl get nodes

# List pods in current namespace
kubectl get pods

# List pods in all namespaces
kubectl get pods --all-namespaces

# Describe a resource (detailed info)
kubectl describe pod my-pod

# Get logs from a pod
kubectl logs my-pod

# Execute commands in a pod
kubectl exec -it my-pod -- /bin/bash
```

### Working with Resources
```bash
# Apply configuration from file
kubectl apply -f my-app.yaml

# Delete resources
kubectl delete -f my-app.yaml
kubectl delete pod my-pod

# Scale deployment
kubectl scale deployment my-app --replicas=5

# Update deployment image
kubectl set image deployment/my-app container=nginx:1.20

# Check rollout status
kubectl rollout status deployment/my-app
```

### Troubleshooting Commands
```bash
# Check events
kubectl get events

# Debug pod issues
kubectl describe pod problematic-pod

# Check resource usage
kubectl top nodes
kubectl top pods

# Port forwarding for testing
kubectl port-forward pod/my-pod 8080:80
```

## Common Patterns and Best Practices

### 🏗️ Deployment Patterns
1. **Rolling Updates**: Default - gradually replace old pods with new ones
2. **Blue-Green**: Switch traffic between two identical environments
3. **Canary**: Send small percentage of traffic to new version first

### 📏 Resource Management
Always set resource requests and limits:
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "100m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### 🔍 Health Checks
Use probes to ensure your app is healthy:
- **Liveness Probe**: Restarts pod if unhealthy
- **Readiness Probe**: Removes pod from service if not ready
- **Startup Probe**: Gives slow-starting containers time to start

### 🔒 Security Best Practices
- Use non-root containers
- Set security contexts
- Use secrets for sensitive data
- Implement network policies
- Regular security scans

## Learning Path for Beginners

### Phase 1: Basics
1. ✅ Understand architecture (Master/Worker nodes)
2. ✅ Learn about Pods and how to create them
3. ✅ Practice basic kubectl commands
4. ✅ Create your first Deployment

### Phase 2: Networking
1. Understand Services and their types
2. Learn about Ingress for external access
3. Practice service discovery
4. Understand DNS in Kubernetes

### Phase 3: Storage & Configuration
1. Learn ConfigMaps and Secrets
2. Understand Persistent Volumes
3. Work with StatefulSets
4. Practice configuration management

### Phase 4: Advanced Topics
1. RBAC and security
2. Monitoring and logging
3. Custom Resource Definitions
4. Operators and controllers

## Troubleshooting Guide

### Pod Issues
```bash
# Pod stuck in Pending
kubectl describe pod <pod-name>  # Check events for resource issues

# Pod stuck in CrashLoopBackOff
kubectl logs <pod-name>  # Check application logs
kubectl logs <pod-name> --previous  # Check previous container logs

# Pod stuck in ImagePullBackOff
kubectl describe pod <pod-name>  # Check image name and registry access
```

### Service Issues
```bash
# Service not accessible
kubectl get endpoints <service-name>  # Check if pods are selected
kubectl describe service <service-name>  # Check selector and ports
```

### Common Error Messages
- **ImagePullBackOff**: Wrong image name or no access to registry
- **CrashLoopBackOff**: Application keeps crashing, check logs
- **Pending**: Not enough resources or scheduling issues
- **Error**: Generic error, check events and logs

## Helpful Resources
- [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Play with Kubernetes](https://labs.play-with-k8s.com/) - Free online playground
- [Katacoda Kubernetes Scenarios](https://www.katacoda.com/courses/kubernetes) - Interactive tutorials

Remember: Kubernetes has a steep learning curve, but start with the basics and practice regularly! 🚀