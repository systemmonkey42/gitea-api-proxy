


# Gitea API Proxy


Using the [SourceGraph][1] application can automatically import repositories from a number of Git services (github, gitlab, etc) however does not natively support Gitea.

This service is written in node JS (requires nodeJS v14 or higher) and implements just enough
github API to allow SourceGraph to verify the user, and download the repository list.

Once that is done, SourceGraph uses the repository URLs directory (with the provided token) and
no-longer calls the proxy.

As long as the proxy is left running, SoureGraph will find new gitea repositories every so often.


##  Building
This is a very simple project, but requires npm to install the dependencies.

### Manual

After cloning this repository, simply install the dependencies using the command:
```
npm install
```

To launch the api-proxy, simply run `node .` in the root of the project.

### Docker

The provided _Dockerfile_ can be used to quickly build a working docker image. There is no configuration and no storage requirements.

Running the following command:

```bash
docker build -t apiproxy:latest .
```

Will create a docker image called `apiproxy:latest`.

An existing docker contain can be found in docker hub as `systemmonkey42/apiproxy:latest`.

#### Sample docker configuration

The following is a simple docker-compose file which can launch the api proxy


```yaml
version: '2.3'

services:
  gitea_apiproxy:
    image: systemmonkey42/apiproxy:latest
    restart: always
    ports:
      - 9980:9980
```


Within Sourcegraph, create a new *Code Host* and select the _Github_ option.

Edit the provided JSON configuration to provide the following details

```json
{
  "url": "http://<proxyhostip>:9980",
  "token": "<gitea api key>",
  "repositoryPathPattern": "<gitea host>/{nameWithOwner}",
  "repositoryQuery": [
    "affiliated"
  ]
}

```

Once you submit the new code host definition, SourceGraph should immediately connect, download the list of repositories accessible by the provided API Key, and start cloning and indexing everything.


[1]: https://github.com/sourcegraph/sourcegraph
