## test on local
---------------------------------
```
npm run dev
```


## run on docker
---------------------------------

create subnet
```
docker network create --subnet=10.10.0.0/16 kv_subnet
```

build
```
docker build -t jinnyjinnyuwu/cse-138_assignment2:1.0 .
```

run main instance container
```
docker run -p 13800:13800 --net=kv_subnet --ip=10.10.0.2 --name="kvs-main" [image id]
```

run follower instance container
```
docker run -p 13801:13800 --net=kv_subnet --ip=10.10.0.3 --name="kvs-follower1" --env FORWARDING_ADDRESS="10.10.0.2:13800" [image id]
```



## DOCKER BASICS
---------------------------------

build code into docker image
```
docker build -t jinnyjinnyuwu/[imagename]:[version] .
```

run docker image (creating a container)
```
docker run -p 13800:13800 [image id]
```

