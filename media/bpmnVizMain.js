// @ts-check

//const { type } = require("os");

// This script is run within the webview itself
(function () {
    // @ts-ignore
    const vscode = acquireVsCodeApi();
    let g_bpmnDetails = []
    const bpmnContainerElt = window.document.getElementById('bpmn-container');

    
    const bpmnVisualization = new bpmnvisu.BpmnVisualization({container: bpmnContainerElt});


    function updateContent(/** @type {string} */ text, /** @type {array} */ bpmnDetails) {
        bpmnVisualization.load(text);
        const bpmnElementsRegistry = bpmnVisualization.bpmnElementsRegistry;
        console.log("bpmnDetails",bpmnDetails);
        g_bpmnDetails = bpmnDetails;
        
        let ids = g_bpmnDetails?.bpmnActivityInfos.map(x=>x.id);
        console.log("ids",ids);
        let elementsWithPopup = bpmnElementsRegistry.getElementsByIds(ids)
        console.log("bpmnElementsRegistry",elementsWithPopup);
        elementsWithPopup.forEach(bpmnElement => {
            const htmlElement = bpmnElement.htmlElement;
            const isEdge = !bpmnElement.bpmnSemantic.isShape;
            const offset = isEdge? [0, -40] : undefined;
            tippy(htmlElement, {
                // work perfectly on hover with or without 'diagram navigation' enable
                appendTo: bpmnContainerElt.parentElement,
    
                // https://atomiks.github.io/tippyjs/v6/all-props/#sticky
                // This has a performance cost since checks are run on every animation frame. Use this only when necessary!
                // only check the "reference" rect for changes
                sticky: 'reference',
    
                arrow: false,
                offset: offset,
                placement: 'bottom',
            });
        });
        
    }

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        console.log("Message recieved", event);
        const message = event.data; // The json data that the extension sent
        switch (message.type) {
            case 'update':
                const text = message.text;
                const bpmnDetails = message.bpmnDetails;

                // Update our webview's content
                updateContent(text, bpmnDetails);

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

    function getBpmnElementInfoAsHtml(htmlElement) {
        const bpmnId = htmlElement.dataset.bpmnId;
        console.log("[getBpmnElementInfoAsHtml]bpmnId", bpmnId, " g_bpmnDetails",g_bpmnDetails);
        const [elementData,...rest] =  g_bpmnDetails?.bpmnActivityInfos.filter(x=>bpmnId===x.id);
        console.log("[getBpmnElementInfoAsHtml]bpmnId", bpmnId, "elementData",elementData);
        return `<div class="bpmn-popover">
        BPMN Info2
        <hr>
        ${computeBpmnInfoForPopover(elementData)}
    </div>`
    }

    // const elemnentKeys = ['id', 'name',];
    function computeBpmnInfoForPopover(elementData) {
        const header =  `<b>ID:</b> ${elementData.id}</br> <b>Name:</b> ${elementData.name} </br>`
        const enxtensions = elementData.extensionElements.map(ed =>`<b>${ed.key}:</b> ${ed.value}`).join('<br>\n');
        return header + "<hr>"+ enxtensions;
    }


// tippy global configuration
tippy.setDefaultProps({
    content: 'Loading...',
    allowHTML: true,
    onShow(instance) {
        instance.setContent(getBpmnElementInfoAsHtml(instance.reference));
    },
    onHidden(instance) {
        instance.setContent('Loading...');
    },

    // don't consider `data-tippy-*` attributes on the reference element as we fully manage tippy with javascript
    // and we cannot update the reference here as it is generated by bpmn-visualization
    ignoreAttributes: true,

    // https://atomiks.github.io/tippyjs/v6/all-props/#popperoptions
    // modifiers: [
    //     {
    //         name: 'computeStyles',
    //         options: {
    //             adaptive: false, // true by default
    //         },
    //     },
    // ],
    // popperOptions: {
    //     strategy: 'fixed',
    // },


    // https://atomiks.github.io/tippyjs/v6/all-props/#placement

    // https://atomiks.github.io/tippyjs/v6/all-props/#inlinepositioning
    // inlinePositioning: true,

    // https://atomiks.github.io/tippyjs/v6/all-props/#interactive
    interactive: true,

    // https://atomiks.github.io/tippyjs/v6/all-props/#movetransition
    // custom transition --> not needed
    // moveTransition: 'transform 0.2s ease-out',
});
    



}());



