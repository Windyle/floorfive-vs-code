export const PANEL_EMPTY_HTML: string = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <!-- Custom CSS -->
    <style>
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            width: 100vw;
            color: var(--vscode-editor-foreground);
            opacity: 0.2;
            font-size: 0.7rem;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>No commands to show for this workspace.</h1>
    </div>
</body>

</html>

`;