<!-- omit in toc -->
# pgn-editor

Chess editor to easily create PGN files.

<!-- omit in toc -->
## Table of Contents

- [Usage](#usage)
- [License](#license)
- [Development](#development)
    - [Install dependencies](#install-dependencies)
    - [Build & start server](#build--start-server)
    - [Build & run tests](#build--run-tests)

## Usage

Create a docker image

```
docker build -t npm-editor .
```

Run the docker image

```
docker run -p 8080:80 npm-editor:latest
```

Open http://localhost:8080/

## License

GPLv3. See [LICENSE](LICENSE).

## Development

### Install dependencies
```bash
npm install
```

### Build & start server
```bash
npm start
```

Open http://localhost:8080/

### Build & run tests
```bash
npm test
```
