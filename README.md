# RiskID

RiskID is a web application designed to generate fully labeled connection datasets. It uses visualization techniques and label recommendations to give the user greater support in the labeling process.
## Getting Started 🚀

### Prerequisites 📋
For a correct operation of RiskID, you should have the following:
 - An Ubuntu 16.04 (or high) server and a regular, non-root user with sudo privileges.
 - An Apache2 web server
 - A MongoDB database server
 - A NodeJS cross-platform JavaScript run-time environment

If you do not have any of these tools installed, follow these steps for easy installation. (This simple guide was developed using an Ubuntu 18.04 operating system)

Installing Apache Web Server
Update your local package index:
```
$ sudo apt update
```
Install the apache2 package:
```
$ sudo apt install apache2
```

Installing MongoDB
Install the MongoDB package:
```
$ sudo apt install -y mongodb
```
This command installs several packages containing the latest stable version of MongoDB, along with helpful management tools for the MongoDB server. The database server is automatically started after installation.

Installing NodeJS
Install Node.js from the repositories:
```
$ sudo apt install nodejs
```
You'll also want to also install npm, the Node.js package manager. You can do this by typing:
```
$ sudo apt install npm
```


### Installing 🔧

If the prerequisites are met, installing the RiskID demo and starting to label is very easy.

First download the RiskID demo project.
```
$ git clone https://github.com/jorgeguerra881215/riskIDemo.git
```

Once you clone the RikID repository, move the project inside apache web server launch folder.
```
$ sudo mv riskIDemo /var/www/html/
```

Run node project
```
$ node riskIDemo/app.js
```

Finally point the web browser to http://localhots:3000


## Running the tests ⚙️

Initially the application comes with a set of previously loaded connections. A part of this dataset has been labeled and the rest has a label recommendation. To start using the application it is necessary to create a user and start session.


## Built With 🛠️

This version of RiskID was developed using:
* [PyCharm](https://www.jetbrains.com/pycharm/) - IDE
* [D3JS](https://d3js.org/) -  Data-Driven Documents
* [NODEJS](https://nodejs.org/) - Environment


## Authors ✒️

* **Jorge L. Guerra** - *Main developer* - [jorge](https://github.com/jorgeguerra881215)
* **Eduardo Veas** - *Visualization skill* - [eduveas]()
* **Carlos Catania** - *Machine Learning skill* - [ccatania]()


## Acknowledgments 🎁

* Special thanks to National Scientific and Technical Research Council (CONICET, Argentina)

---
