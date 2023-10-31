kubectl delete -f k8-pod-api.yaml -n the-application
kubectl delete -f k8-service-api.yaml -n the-application

kubectl delete -f k8-pod-ui.yaml -n the-application
kubectl delete -f k8-service-ui.yaml -n the-application
