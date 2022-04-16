/**
 * Constructs a new moonspeak editor
 */
MoonspeakEditor = function(chromeless, themes, model, graph, editable)
{
	mxEventSource.call(this);
    this.preinit();
    this.editorUi = new EditorUi(new Editor(chromeless, themes, model, graph, editable));
	this.init();
};

/**
 * MoonspeakEditor inherits from mxEventSource
 */
mxUtils.extend(MoonspeakEditor, mxEventSource);

/**
 * ===============================================================
 * Place MoonspeakEditor functionality below
 */

/**
 * This is called before EditorUi.init() and Editor.init()
 * Specifically for hacks that add behaiviour and then call the base function
 */
MoonspeakEditor.prototype.preinit = function()
{

    // hide the left sidebar
    EditorUi.prototype.splitSize = 0;
    EditorUi.prototype.hsplitPosition = 0;

    // hide the footer at bottom of page
    EditorUi.prototype.footerHeight = 0;

    // scrollbars must be enabled at all times so iframes do not reload
    Graph.prototype.defaultScrollbars = true;

    // this function must be overriden to retain thin scrollbar styling
	let mxGraphView_validateBackgroundStyles = mxGraphView.prototype.validateBackgroundStyles;
    mxGraphView.prototype.validateBackgroundStyles = function()
    {
        // here "this" is an mxGraphView instance
		mxGraphView_validateBackgroundStyles.apply(this, arguments);
        this.graph.container.classList.add("styled-scrollbars");
    }

    // disable creation of top menubar
    EditorUi.prototype.menubarHeight = 0;
    Menus.prototype.createMenubar = function(container)
    {
        return null;
    }

    // configure how background pages are displayed
    Graph.prototype.defaultPageVisible = false;
    EditorUi.prototype.wheelZoomDelay = 80;
    EditorUi.prototype.buttonZoomDelay = 80;
};

/**
 * This is called after EditorUi.init()
 * Specifically for hacks that drive change in EditorUi
 */
MoonspeakEditor.prototype.init = function()
{
    // hide the right sidebar
    this.editorUi.toggleFormatPanel(false);

    // hide the left sidebar
    this.editorUi.hsplitPosition = 0;
    this.editorUi.refresh();

    var divRight = document.createElement('div');
    divRight.className = "bottomright deadzone";
    document.body.appendChild(divRight);

    var divLeft = document.createElement('div');
    divLeft.className = "bottomleft deadzone";
    document.body.appendChild(divLeft);
};


/**
 * ===============================================================
 * Place prototype overrides below
 */

// Overridden to limit zoom to 1% - 800%.
Graph.prototype.zoom = function(factor, center)
{
	factor = Math.max(0.01, Math.min(this.view.scale * factor, 8)) / this.view.scale;
	
	mxGraph.prototype.zoom.apply(this, arguments);
};
