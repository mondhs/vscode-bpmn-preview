// @ts-check

// This script is run within the webview itself
(function () {
	// @ts-ignore
	const vscode = acquireVsCodeApi();

    class BpmnVisualizationCustomColorsUserTask extends bpmnvisu.BpmnVisualization {

        constructor(containerId) {
            super({ container: containerId });
            this.configureStyle();
        }
    
        configureStyle() {
            const styleSheet = this.graph.getStylesheet(); // mxStylesheet
            const style = styleSheet.styles[bpmnvisu.ShapeBpmnElementKind.TASK_USER];
            style['fontColor'] = '#2b992a';
       }
    }
    

    const bpmnVisualization = new BpmnVisualizationCustomColorsUserTask('bpmn-container');



    const notesContainer = /** @type {HTMLElement} */ (document.querySelector('.notes'));
    function updateContent(/** @type {string} */ text) {

        bpmnVisualization.load(text);
        // const text2 = document.createElement('div');
        // text2.className = 'text';
        // const textContent = document.createElement('span');
        // textContent.innerText = text;
        // text2.appendChild(textContent);
        // notesContainer.appendChild(text2);

        
    }

    // Handle messages sent from the extension to the webview
	window.addEventListener('message', event => {
        console.log("Message recieved", event);
		const message = event.data; // The json data that the extension sent
		switch (message.type) {
			case 'update':
				const text = message.text;

				// Update our webview's content
				updateContent(text);

				// Then persist state information.
				// This state is returned in the call to `vscode.getState` below when a webview is reloaded.
				vscode.setState({ text });
                

				return;
		}
	});

	// Webviews are normally torn down when not visible and re-created when they become visible again.
	// State lets us save information across these re-loads
	const state = vscode.getState();
	if (state) {
		updateContent(state.text);
	}


}());
