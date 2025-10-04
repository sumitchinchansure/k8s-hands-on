# Kubernetes Hands-On Learning

This repository is designed for hands-on Kubernetes learning with a local 3-node cluster setup using Kind.

## Cluster Setup

### Prerequisites
- Docker
- kubectl
- Kind

### Current Cluster
- **Name**: `k8s-learning-cluster`
- **Nodes**: 1 control-plane + 2 workers
- **Kubernetes Version**: v1.30.0

### Quick Commands
```bash
# View cluster info
kubectl cluster-info

# Get all nodes
kubectl get nodes

# Delete cluster (when done)
kind delete cluster --name k8s-learning-cluster

# Recreate cluster
kind create cluster --config kind-config.yaml
```

## Directory Structure

```
├── kind-config.yaml       # Kind cluster configuration
├── examples/              # Basic K8s examples and tutorials
├── manifests/             # YAML manifests for various resources
├── labs/                  # Hands-on lab exercises
├── scripts/               # Utility scripts
└── notes/                 # Learning notes and documentation
```

## Learning Path

1. **Core Concepts** - Pods, Services, Deployments
2. **Configuration** - ConfigMaps, Secrets
3. **Storage** - Persistent Volumes, Storage Classes
4. **Networking** - Ingress, Network Policies
5. **Security** - RBAC, Pod Security
6. **Monitoring & Logging** - Metrics, Observability
7. **Advanced Topics** - Custom Resources, Operators

## Next Steps

1. Start with basic pod and service examples in `examples/`
2. Work through labs in `labs/`
3. Practice with real-world scenarios in `manifests/`

Happy learning! 🚀