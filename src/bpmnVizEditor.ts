import * as vscode from 'vscode';
import { extractBpmnDetails } from './bpmn_mapping';





/**
 * Provider for BPMN Preview(aka BpmnViz).
 * npm install fast-xml-parser
 * BpmnViz preview are used for `.bpmn` files, which are just json files.
 */
export class BpmnVizProvider implements vscode.CustomTextEditorProvider {

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new BpmnVizProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(BpmnVizProvider.viewType, provider);
        return providerRegistration;
    }

    private static readonly viewType = 'vscodeBpmnPreview.bpmnViz';
    


    constructor(
        private readonly context: vscode.ExtensionContext
    ) { }

    /**
     * Called when our custom editor is opened.
     * 
     * 
     */
    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        
        

        // Setup initial content for the webview
        webviewPanel.webview.options = {
            enableScripts: true,
        };
        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

        const bpmnDetails = extractBpmnDetails(document.getText());
        
        console.log("bpmnDetails", bpmnDetails);
        
        
        
        function updateWebview() {
            webviewPanel.webview.postMessage({
                type: 'update',
                text: document.getText(),
                bpmnDetails: bpmnDetails
            });
        }

        // Hook up event handlers so that we can synchronize the webview with the text document.
        //
        // The text document acts as our model, so we have to sync change in the document to our
        // editor and sync changes in the editor back to the document.
        // 
        // Remember that a single text document can also be shared between multiple custom
        // editors (this happens for example when you split a custom editor)

        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                updateWebview();
            }
        });

        // Make sure we get rid of the listener when our editor is closed.
        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });

        // Receive message from the webview.
        webviewPanel.webview.onDidReceiveMessage(e => {
            e.type;
            
        // 	switch (e.type) {
        // 		case 'add':
        // 			this.addNewScratch(document);
        // 			return;

        // 		case 'delete':
        // 			this.deleteScratch(document, e.id);
        // 			return;
        // 	}
        });

        updateWebview();
    }

    /**
     * Get the static html used for the editor webviews.
     */
    private getHtmlForWebview(webview: vscode.Webview): string {
        // Local path to script and css for the webview
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this.context.extensionUri, 'media', 'bpmnVizMain.js'));
        const bpmnScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this.context.extensionUri, 'media', 'bpmn-visualization.min.js'));
        const popperScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this.context.extensionUri, 'media', 'popper.min.js'));
        const tippyScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this.context.extensionUri, 'media', 'tippy-bundle.umd.min.js'));


        // Use a nonce to whitelist which scripts can be run
        const nonce = getNonce();

        return /* html */`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">

                <!--
                Use a content security policy to only allow loading images from https or from our extension directory,
                and only allow scripts that have a specific nonce.
                <meta http-equiv="Content-Security-Policy" script-src 'unsafe-inline'; content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
                -->
                

                <meta name="viewport" content="width=device-width, initial-scale=1.0">


                <title>BPMN Vizualizatoin</title>
            </head>
            <body style="background-color: white">
                <div class="notes">
                        <span>BPMN Preview8</span>
                </div>
                <div id="bpmn-container" class="col-12 mb-2">
                </div>
                <script nonce="${nonce}" src="${popperScriptUri}"></script>
                <script nonce="${nonce}" src="${tippyScriptUri}"></script>
                <script nonce="${nonce}" src="${bpmnScriptUri}"></script>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
    }

}

export function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}