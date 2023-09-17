export const ANGULAR_DEVELOPMENT_SCRIPTS: string = `
// ==== ANGULAR DEVELOPMENT ====

// => Serve Command

document.getElementById("angular-serve").addEventListener("click", function() {

    const iconTag = this.querySelector('icon');
    const iconName = iconTag.getAttribute('name');

    if(iconName === 'play') {
        iconTag.setAttribute('name', 'square');
        iconTag.innerHTML = icons['square'];
        iconTag.querySelector('svg').classList.add('flip');
        this.querySelector('label').innerHTML = 'Stop Serve';
    }
    else {
        iconTag.setAttribute('name', 'play');
        iconTag.innerHTML = icons['play'];
        iconTag.querySelector('svg').classList.remove('flip');
        this.querySelector('label').innerHTML = 'Serve';

        this.classList.add('disabled');
        setTimeout(() => {
            this.classList.remove('disabled');
        }, 1500);
    }
    
    const message = {
        command: 'angular-serve'
    };

    vscode.postMessage(message);
});

// => End - Serve Command

// => Test Command

document.getElementById("angular-test").addEventListener("click", function() {

    const iconTag = this.querySelector('icon');
    const iconName = iconTag.getAttribute('name');

    if(iconName === 'check-circle') {
        iconTag.setAttribute('name', 'square');
        iconTag.innerHTML = icons['square'];
        iconTag.querySelector('svg').classList.add('flip');
        this.querySelector('label').innerHTML = 'Stop Test';
    }
    else {
        iconTag.setAttribute('name', 'check-circle');
        iconTag.innerHTML = icons['check-circle'];
        iconTag.querySelector('svg').classList.remove('flip');
        this.querySelector('label').innerHTML = 'Test';
    }
    
    const message = {
        command: 'angular-test'
    };

    vscode.postMessage(message);

});

// => End - Test Command

// => Build Command

document.getElementById("angular-build").addEventListener("click", function() {

    const iconTag = this.querySelector('icon');
    const iconName = iconTag.getAttribute('name');

    if(iconName === 'package') {
        iconTag.setAttribute('name', 'loader');
        iconTag.innerHTML = icons['loader'];
        iconTag.querySelector('svg').classList.add('spin');
        this.querySelector('label').innerHTML = 'Stop Build';
    }
    else {
        iconTag.setAttribute('name', 'package');
        iconTag.innerHTML = icons['package'];
        iconTag.querySelector('svg').classList.remove('spin');
        this.querySelector('label').innerHTML = 'Build';
    }
    
    const message = {
        command: 'angular-build'
    };

    vscode.postMessage(message);

});

// => End - Build Command

// => Build Watch Command

document.getElementById("angular-build-watch").addEventListener("click", function() {

    const iconTag = this.querySelector('icon');
    const iconName = iconTag.getAttribute('name');

    if(iconName === 'eye') {
        iconTag.setAttribute('name', 'square');
        iconTag.innerHTML = icons['square'];
        iconTag.querySelector('svg').classList.add('flip');
        this.querySelector('label').innerHTML = 'Stop Build';
    }
    else {
        iconTag.setAttribute('name', 'eye');
        iconTag.innerHTML = icons['eye'];
        iconTag.querySelector('svg').classList.remove('flip');
        this.querySelector('label').innerHTML = 'Build Watch';
    }
    
    const message = {
        command: 'angular-build-watch'
    };

    vscode.postMessage(message);

});

// => End - Build Watch Command
`;

export const ANGULAR_DEVELOPMENT_LISTENERS_SCRIPT: string = `
case 'angular-serve':
    break;
case 'angular-test':
    break;
case 'angular-build':
    break;
case 'angular-build-watch':
    break;
`;