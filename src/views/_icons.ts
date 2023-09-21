export const ICONS = [
    `arrows-right-left`,
    `check-circle`,
    `chevron-left`,
    `chevron-right`,
    `copy`,
    `download-cloud`,
    `external-link`,
    `eye`,
    `loader`,
    `package`,
    `play`,
    `search`,
    `settings`,
    `square`,
    `upload-cloud`,
    `x-circle`
];

export const ICONS_SCRIPT = `
// ==== ICONS ====

var icons = {
    "arrows-right-left": \`{{arrowsRightLeftIcon}}\`,
    "check-circle": \`{{checkCircleIcon}}\`,
    "chevron-left": \`{{chevronLeftIcon}}\`,
    "chevron-right": \`{{chevronRightIcon}}\`,
    "copy": \`{{copyIcon}}\`,
    "download-cloud": \`{{downloadCloudIcon}}\`,
    "external-link": \`{{externalLinkIcon}}\`,
    "eye": \`{{eyeIcon}}\`,
    "loader": \`{{loaderIcon}}\`,
    "package": \`{{packageIcon}}\`,
    "play": \`{{playIcon}}\`,
    "search": \`{{searchIcon}}\`,
    "settings": \`{{settingsIcon}}\`,
    "square": \`{{squareIcon}}\`,
    "upload-cloud": \`{{uploadCloudIcon}}\`,
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