# ArgoCD GitOps Setup Guide

## What is ArgoCD?
ArgoCD is a GitOps tool that automatically deploys your applications to Kubernetes whenever you make changes to your Git repository. It watches your Git repo and keeps your cluster in sync with what's defined in your code.

## How ArgoCD Works
1. **Watch Git Repository** - ArgoCD monitors your GitHub repo for changes
2. **Compare State** - Compares what's in Git vs what's running in Kubernetes
3. **Auto-Deploy** - Automatically applies changes to keep them in sync
4. **Self-Healing** - If someone manually changes the cluster, ArgoCD reverts it back to match Git

## Quick Setup Steps

### 1. Install ArgoCD
```bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for pods to be ready
kubectl wait --for=condition=Ready pods --all -n argocd --timeout=300s
```

### 2. Access ArgoCD UI
```bash
# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Port forward to access UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

**Access UI**: https://localhost:8080
- **Username**: admin
- **Password**: (from step above)

### 3. Create Application
Create `argocd/surprise-me-app.yaml`:
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: surprise-me-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/YOUR-USERNAME/YOUR-REPO.git
    targetRevision: HEAD
    path: k8s/base  # Path to your Kubernetes manifests
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  syncPolicy:
    automated:
      prune: true      # Remove resources not in Git
      selfHeal: true   # Fix manual changes
```

Apply it:
```bash
kubectl apply -f argocd/surprise-me-app.yaml
```

## How to Test GitOps
1. Edit any Kubernetes manifest in `k8s/base/`
2. Commit and push to GitHub
3. Watch ArgoCD automatically deploy changes (within 3 minutes)
4. Check ArgoCD UI to see sync status

## Key Benefits
- **Git as Single Source of Truth** - Everything is versioned and auditable
- **Automatic Deployment** - No manual kubectl commands needed
- **Self-Healing** - Automatically fixes configuration drift
- **Rollback** - Easy to revert by reverting Git commits
- **Security** - ArgoCD runs inside cluster, no external access needed

## Troubleshooting
- **App not syncing**: Check repository URL and path in Application spec
- **Permission errors**: Ensure ArgoCD has access to your Git repository
- **UI not loading**: Verify port-forward is running and try http://localhost:8080