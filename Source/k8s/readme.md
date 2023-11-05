<hr/>
<h2>Docker</h2>
To Build

    `docker build -t docker-dotnet .`

To Run

    `docker run -d -p 8080:80 --name docker-dotnet-app vermavarun/docker-dotnet`

Now Visit

<a href="http://localhost:8080/weatherforecast"> Localhost </a>

<hr/>
<h2>Kubernetes</h2>

To Apply K8s Deployment for WebApi Pod

    `kubectl apply -f k8-Deploy-Pod.yaml`

To Apply K8s Deployment for pod+service

    `kubectl apply -f k8-Deploy-pod-service.yaml -n dotnet-docker`

OR

    `kubectl apply -f k8-pod.yaml -n dotnet-docker`

    `kubectl apply -f k8-service.yaml -n dotnet-docker`

And Visit <a href="http://localhost/weatherforecast"> Localhost </a>

To get IP address

`kubectl get pods -o wide`

<hr/>
<h2>Docker Cheet Sheet</h2>
<li>docker ps<l/i>

<hr/>
<h2>Kubernetes Cheet Sheet</h2>
<h3>Namespaces</h3>
<li>kubectl create namespace {insert-namespace-name-here} </li>
<li>kubectl config set-context --current --namespace=my-namespace</li>
<li>kubectl config view | grep namespace</li>
<li>kubectl set env deployment/react-ui REACT_APP_API_URL=http://10.97.38.222/</li>
<li>kubectl get svc</li> // to get ip of api service


<hr/>
<h1>Latest update</h1>

To create API and UI running

    ./create.sh

Visit [UI](http://localhost:1234) in browser


To Delete API and UI

    ./delete.sh
