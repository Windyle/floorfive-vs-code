export const KBS6_LIB_SCRIPTS: string = `
// ==== KBS6 LIB ====

// => Compare Command

document.getElementById("kbs6-lib-compare").addEventListener("click", function() {

    const iconTag = this.querySelector('icon');
    const iconName = iconTag.getAttribute('name');

    if(iconName === 'arrows-right-left') {
        iconTag.setAttribute('name', 'square');
        iconTag.innerHTML = icons['square'];
        iconTag.querySelector('svg').classList.add('flip');
        this.querySelector('label').innerHTML = 'Stop Compare Version';
    }
    else {
        iconTag.setAttribute('name', 'arrows-right-left');
        iconTag.innerHTML = icons['arrows-right-left'];
        iconTag.querySelector('svg').classList.remove('flip');
        this.querySelector('label').innerHTML = 'Compare Version';

        this.classList.add('disabled');
        setTimeout(() => {
            this.classList.remove('disabled');
        }, 1500);
    }
    
    const message = {
        command: 'kbs6-lib-compare'
    };

    vscode.postMessage(message);
});

// => End - Compare Command
`;

export const KBS6_LIB_LISTENERS_SCRIPT: string = `
case 'kbs6-lib-compare':
    break;
`;