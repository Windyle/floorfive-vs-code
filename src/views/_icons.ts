export const ICONS = [
    `check-circle`,
    `copy`,
    `external-link`,
    `eye`,
    `loader`,
    `package`,
    `play`,
    `settings`,
    `square`,
    `x-circle`
];

export const ICONS_SCRIPT = `
// ==== ICONS ====

var icons = {
    "check-circle": \`{{checkCircleIcon}}\`,
    "copy": \`{{copyIcon}}\`,
    "external-link": \`{{externalLinkIcon}}\`,
    "eye": \`{{eyeIcon}}\`,
    "loader": \`{{loaderIcon}}\`,
    "package": \`{{packageIcon}}\`,
    "play": \`{{playIcon}}\`,
    "settings": \`{{settingsIcon}}\`,
    "square": \`{{squareIcon}}\`,
    "x-circle": \`{{xCircleIcon}}\`
};

// ==== ASSIGN ICONS ====

// Search icon tags by alt attribute
const iconTags = document.querySelectorAll('icon[name]');

// Assign icons
iconTags.forEach(function(iconTag) {
    iconTag.innerHTML = icons[iconTag.getAttribute('name')];
});

`;