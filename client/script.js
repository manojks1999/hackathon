const socket = io();

// setting round_name before itself it is assigning before game start so simulating manually here event "server-commence-game"

let executed_set_params = false;
document.getElementById("days-event").addEventListener("click", () => {
    let data = {"user_id": "testinguser", "round_name": "testing_round"}
    console.log("camerer")
    let userInput = prompt("Please enter input:");
    // Displaying the input in an alert
    if (userInput !== null && userInput !== "") {
        console.log("user Input", typeof userInput, userInput)
        data = JSON.parse(JSON.parse(userInput))
        console.log("parsed_data", data)
    }
    if(!executed_set_params) {
        socket.emit("set-required-params", {round_name: "dummy-round"})
    }
    socket.emit("server-commence-game", data)
})

document.getElementById("land-selection").addEventListener("click", () => {
    let data = {}
    if(!executed_set_params) {
        socket.emit("set-required-params", {round_name: "dummy-round"})
    }
socket.emit("server-disable-add-button", data)
})

document.getElementById("land-purchase").addEventListener("click", () => {
    let data = {"tile_id":"46","in_game":"yes","tile_count":{"farm":40,"class-name":"trans-tile-right-single"},"x":1082.5390625,"y":327.296875,"id":"cV2oy8mq2vSZA_3aAAAC","name":"jdss"}
    let userInput = prompt("Please enter input:");
    // Displaying the input in an alert
    if (userInput !== null && userInput !== "") {
        console.log("user Input", typeof userInput, userInput)
        data = JSON.parse(JSON.parse(userInput))
        console.log("parsed_data", data)
    }
    if(!executed_set_params) {
        socket.emit("set-required-params", {round_name: "dummy-round"})
    }
    socket.emit("buy-tile", data)
})

document.getElementById("harvest-land").addEventListener("click", () => {
    let data = {"tileName":"farm","tileNo":"1","cost":20,"week":5,"seconds":140,"status":"complete","className":{"0":"width","accentColor":"","additiveSymbols":"","alignContent":"","alignItems":"","alignSelf":"","alignmentBaseline":"","all":"","animation":"","animationComposition":"","animationDelay":"","animationDirection":"","animationDuration":"","animationFillMode":"","animationIterationCount":"","animationName":"","animationPlayState":"","animationRange":"","animationRangeEnd":"","animationRangeStart":"","animationTimeline":"","animationTimingFunction":"","appRegion":"","appearance":"","ascentOverride":"","aspectRatio":"","backdropFilter":"","backfaceVisibility":"","background":"","backgroundAttachment":"","backgroundBlendMode":"","backgroundClip":"","backgroundColor":"","backgroundImage":"","backgroundOrigin":"","backgroundPosition":"","backgroundPositionX":"","backgroundPositionY":"","backgroundRepeat":"","backgroundSize":"","basePalette":"","baselineShift":"","baselineSource":"","blockSize":"","border":"","borderBlock":"","borderBlockColor":"","borderBlockEnd":"","borderBlockEndColor":"","borderBlockEndStyle":"","borderBlockEndWidth":"","borderBlockStart":"","borderBlockStartColor":"","borderBlockStartStyle":"","borderBlockStartWidth":"","borderBlockStyle":"","borderBlockWidth":"","borderBottom":"","borderBottomColor":"","borderBottomLeftRadius":"","borderBottomRightRadius":"","borderBottomStyle":"","borderBottomWidth":"","borderCollapse":"","borderColor":"","borderEndEndRadius":"","borderEndStartRadius":"","borderImage":"","borderImageOutset":"","borderImageRepeat":"","borderImageSlice":"","borderImageSource":"","borderImageWidth":"","borderInline":"","borderInlineColor":"","borderInlineEnd":"","borderInlineEndColor":"","borderInlineEndStyle":"","borderInlineEndWidth":"","borderInlineStart":"","borderInlineStartColor":"","borderInlineStartStyle":"","borderInlineStartWidth":"","borderInlineStyle":"","borderInlineWidth":"","borderLeft":"","borderLeftColor":"","borderLeftStyle":"","borderLeftWidth":"","borderRadius":"","borderRight":"","borderRightColor":"","borderRightStyle":"","borderRightWidth":"","borderSpacing":"","borderStartEndRadius":"","borderStartStartRadius":"","borderStyle":"","borderTop":"","borderTopColor":"","borderTopLeftRadius":"","borderTopRightRadius":"","borderTopStyle":"","borderTopWidth":"","borderWidth":"","bottom":"","boxShadow":"","boxSizing":"","breakAfter":"","breakBefore":"","breakInside":"","bufferedRendering":"","captionSide":"","caretColor":"","clear":"","clip":"","clipPath":"","clipRule":"","color":"","colorInterpolation":"","colorInterpolationFilters":"","colorRendering":"","colorScheme":"","columnCount":"","columnFill":"","columnGap":"","columnRule":"","columnRuleColor":"","columnRuleStyle":"","columnRuleWidth":"","columnSpan":"","columnWidth":"","columns":"","contain":"","containIntrinsicBlockSize":"","containIntrinsicHeight":"","containIntrinsicInlineSize":"","containIntrinsicSize":"","containIntrinsicWidth":"","container":"","containerName":"","containerType":"","content":"","contentVisibility":"","counterIncrement":"","counterReset":"","counterSet":"","cursor":"","cx":"","cy":"","d":"","descentOverride":"","direction":"","display":"","dominantBaseline":"","emptyCells":"","fallback":"","fill":"","fillOpacity":"","fillRule":"","filter":"","flex":"","flexBasis":"","flexDirection":"","flexFlow":"","flexGrow":"","flexShrink":"","flexWrap":"","float":"","floodColor":"","floodOpacity":"","font":"","fontDisplay":"","fontFamily":"","fontFeatureSettings":"","fontKerning":"","fontOpticalSizing":"","fontPalette":"","fontSize":"","fontStretch":"","fontStyle":"","fontSynthesis":"","fontSynthesisSmallCaps":"","fontSynthesisStyle":"","fontSynthesisWeight":"","fontVariant":"","fontVariantAlternates":"","fontVariantCaps":"","fontVariantEastAsian":"","fontVariantLigatures":"","fontVariantNumeric":"","fontVariantPosition":"","fontVariationSettings":"","fontWeight":"","forcedColorAdjust":"","gap":"","grid":"","gridArea":"","gridAutoColumns":"","gridAutoFlow":"","gridAutoRows":"","gridColumn":"","gridColumnEnd":"","gridColumnGap":"","gridColumnStart":"","gridGap":"","gridRow":"","gridRowEnd":"","gridRowGap":"","gridRowStart":"","gridTemplate":"","gridTemplateAreas":"","gridTemplateColumns":"","gridTemplateRows":"","height":"","hyphenateCharacter":"","hyphenateLimitChars":"","hyphens":"","imageOrientation":"","imageRendering":"","inherits":"","initialLetter":"","initialValue":"","inlineSize":"","inset":"","insetBlock":"","insetBlockEnd":"","insetBlockStart":"","insetInline":"","insetInlineEnd":"","insetInlineStart":"","isolation":"","justifyContent":"","justifyItems":"","justifySelf":"","left":"","letterSpacing":"","lightingColor":"","lineBreak":"","lineGapOverride":"","lineHeight":"","listStyle":"","listStyleImage":"","listStylePosition":"","listStyleType":"","margin":"","marginBlock":"","marginBlockEnd":"","marginBlockStart":"","marginBottom":"","marginInline":"","marginInlineEnd":"","marginInlineStart":"","marginLeft":"","marginRight":"","marginTop":"","marker":"","markerEnd":"","markerMid":"","markerStart":"","mask":"","maskClip":"","maskComposite":"","maskImage":"","maskMode":"","maskOrigin":"","maskPosition":"","maskRepeat":"","maskSize":"","maskType":"","mathDepth":"","mathShift":"","mathStyle":"","maxBlockSize":"","maxHeight":"","maxInlineSize":"","maxWidth":"","minBlockSize":"","minHeight":"","minInlineSize":"","minWidth":"","mixBlendMode":"","negative":"","objectFit":"","objectPosition":"","objectViewBox":"","offset":"","offsetAnchor":"","offsetDistance":"","offsetPath":"","offsetPosition":"","offsetRotate":"","opacity":"","order":"","orphans":"","outline":"","outlineColor":"","outlineOffset":"","outlineStyle":"","outlineWidth":"","overflow":"","overflowAnchor":"","overflowClipMargin":"","overflowWrap":"","overflowX":"","overflowY":"","overlay":"","overrideColors":"","overscrollBehavior":"","overscrollBehaviorBlock":"","overscrollBehaviorInline":"","overscrollBehaviorX":"","overscrollBehaviorY":"","pad":"","padding":"","paddingBlock":"","paddingBlockEnd":"","paddingBlockStart":"","paddingBottom":"","paddingInline":"","paddingInlineEnd":"","paddingInlineStart":"","paddingLeft":"","paddingRight":"","paddingTop":"","page":"","pageBreakAfter":"","pageBreakBefore":"","pageBreakInside":"","pageOrientation":"","paintOrder":"","perspective":"","perspectiveOrigin":"","placeContent":"","placeItems":"","placeSelf":"","pointerEvents":"","position":"","prefix":"","quotes":"","r":"","range":"","resize":"","right":"","rotate":"","rowGap":"","rubyPosition":"","rx":"","ry":"","scale":"","scrollBehavior":"","scrollMargin":"","scrollMarginBlock":"","scrollMarginBlockEnd":"","scrollMarginBlockStart":"","scrollMarginBottom":"","scrollMarginInline":"","scrollMarginInlineEnd":"","scrollMarginInlineStart":"","scrollMarginLeft":"","scrollMarginRight":"","scrollMarginTop":"","scrollPadding":"","scrollPaddingBlock":"","scrollPaddingBlockEnd":"","scrollPaddingBlockStart":"","scrollPaddingBottom":"","scrollPaddingInline":"","scrollPaddingInlineEnd":"","scrollPaddingInlineStart":"","scrollPaddingLeft":"","scrollPaddingRight":"","scrollPaddingTop":"","scrollSnapAlign":"","scrollSnapStop":"","scrollSnapType":"","scrollTimeline":"","scrollTimelineAxis":"","scrollTimelineName":"","scrollbarGutter":"","shapeImageThreshold":"","shapeMargin":"","shapeOutside":"","shapeRendering":"","size":"","sizeAdjust":"","speak":"","speakAs":"","src":"","stopColor":"","stopOpacity":"","stroke":"","strokeDasharray":"","strokeDashoffset":"","strokeLinecap":"","strokeLinejoin":"","strokeMiterlimit":"","strokeOpacity":"","strokeWidth":"","suffix":"","symbols":"","syntax":"","system":"","tabSize":"","tableLayout":"","textAlign":"","textAlignLast":"","textAnchor":"","textCombineUpright":"","textDecoration":"","textDecorationColor":"","textDecorationLine":"","textDecorationSkipInk":"","textDecorationStyle":"","textDecorationThickness":"","textEmphasis":"","textEmphasisColor":"","textEmphasisPosition":"","textEmphasisStyle":"","textIndent":"","textOrientation":"","textOverflow":"","textRendering":"","textShadow":"","textSizeAdjust":"","textTransform":"","textUnderlineOffset":"","textUnderlinePosition":"","textWrap":"","timelineScope":"","top":"","touchAction":"","transform":"","transformBox":"","transformOrigin":"","transformStyle":"","transition":"","transitionBehavior":"","transitionDelay":"","transitionDuration":"","transitionProperty":"","transitionTimingFunction":"","translate":"","unicodeBidi":"","unicodeRange":"","userSelect":"","vectorEffect":"","verticalAlign":"","viewTimeline":"","viewTimelineAxis":"","viewTimelineInset":"","viewTimelineName":"","viewTransitionName":"","visibility":"","webkitAlignContent":"","webkitAlignItems":"","webkitAlignSelf":"","webkitAnimation":"","webkitAnimationDelay":"","webkitAnimationDirection":"","webkitAnimationDuration":"","webkitAnimationFillMode":"","webkitAnimationIterationCount":"","webkitAnimationName":"","webkitAnimationPlayState":"","webkitAnimationTimingFunction":"","webkitAppRegion":"","webkitAppearance":"","webkitBackfaceVisibility":"","webkitBackgroundClip":"","webkitBackgroundOrigin":"","webkitBackgroundSize":"","webkitBorderAfter":"","webkitBorderAfterColor":"","webkitBorderAfterStyle":"","webkitBorderAfterWidth":"","webkitBorderBefore":"","webkitBorderBeforeColor":"","webkitBorderBeforeStyle":"","webkitBorderBeforeWidth":"","webkitBorderBottomLeftRadius":"","webkitBorderBottomRightRadius":"","webkitBorderEnd":"","webkitBorderEndColor":"","webkitBorderEndStyle":"","webkitBorderEndWidth":"","webkitBorderHorizontalSpacing":"","webkitBorderImage":"","webkitBorderRadius":"","webkitBorderStart":"","webkitBorderStartColor":"","webkitBorderStartStyle":"","webkitBorderStartWidth":"","webkitBorderTopLeftRadius":"","webkitBorderTopRightRadius":"","webkitBorderVerticalSpacing":"","webkitBoxAlign":"","webkitBoxDecorationBreak":"","webkitBoxDirection":"","webkitBoxFlex":"","webkitBoxOrdinalGroup":"","webkitBoxOrient":"","webkitBoxPack":"","webkitBoxReflect":"","webkitBoxShadow":"","webkitBoxSizing":"","webkitClipPath":"","webkitColumnBreakAfter":"","webkitColumnBreakBefore":"","webkitColumnBreakInside":"","webkitColumnCount":"","webkitColumnGap":"","webkitColumnRule":"","webkitColumnRuleColor":"","webkitColumnRuleStyle":"","webkitColumnRuleWidth":"","webkitColumnSpan":"","webkitColumnWidth":"","webkitColumns":"","webkitFilter":"","webkitFlex":"","webkitFlexBasis":"","webkitFlexDirection":"","webkitFlexFlow":"","webkitFlexGrow":"","webkitFlexShrink":"","webkitFlexWrap":"","webkitFontFeatureSettings":"","webkitFontSmoothing":"","webkitHyphenateCharacter":"","webkitJustifyContent":"","webkitLineBreak":"","webkitLineClamp":"","webkitLocale":"","webkitLogicalHeight":"","webkitLogicalWidth":"","webkitMarginAfter":"","webkitMarginBefore":"","webkitMarginEnd":"","webkitMarginStart":"","webkitMask":"","webkitMaskBoxImage":"","webkitMaskBoxImageOutset":"","webkitMaskBoxImageRepeat":"","webkitMaskBoxImageSlice":"","webkitMaskBoxImageSource":"","webkitMaskBoxImageWidth":"","webkitMaskClip":"","webkitMaskComposite":"","webkitMaskImage":"","webkitMaskOrigin":"","webkitMaskPosition":"","webkitMaskPositionX":"","webkitMaskPositionY":"","webkitMaskRepeat":"","webkitMaskSize":"","webkitMaxLogicalHeight":"","webkitMaxLogicalWidth":"","webkitMinLogicalHeight":"","webkitMinLogicalWidth":"","webkitOpacity":"","webkitOrder":"","webkitPaddingAfter":"","webkitPaddingBefore":"","webkitPaddingEnd":"","webkitPaddingStart":"","webkitPerspective":"","webkitPerspectiveOrigin":"","webkitPerspectiveOriginX":"","webkitPerspectiveOriginY":"","webkitPrintColorAdjust":"","webkitRtlOrdering":"","webkitRubyPosition":"","webkitShapeImageThreshold":"","webkitShapeMargin":"","webkitShapeOutside":"","webkitTapHighlightColor":"","webkitTextCombine":"","webkitTextDecorationsInEffect":"","webkitTextEmphasis":"","webkitTextEmphasisColor":"","webkitTextEmphasisPosition":"","webkitTextEmphasisStyle":"","webkitTextFillColor":"","webkitTextOrientation":"","webkitTextSecurity":"","webkitTextSizeAdjust":"","webkitTextStroke":"","webkitTextStrokeColor":"","webkitTextStrokeWidth":"","webkitTransform":"","webkitTransformOrigin":"","webkitTransformOriginX":"","webkitTransformOriginY":"","webkitTransformOriginZ":"","webkitTransformStyle":"","webkitTransition":"","webkitTransitionDelay":"","webkitTransitionDuration":"","webkitTransitionProperty":"","webkitTransitionTimingFunction":"","webkitUserDrag":"","webkitUserModify":"","webkitUserSelect":"","webkitWritingMode":"","whiteSpace":"","whiteSpaceCollapse":"","widows":"","width":"100.714%","willChange":"","wordBreak":"","wordSpacing":"","wordWrap":"","writingMode":"","x":"","y":"","zIndex":"","zoom":""},"yield":1,"tile-pos":"46","percent":100,"selected-tile":"section1","harvest-count":0,"completeTime":141,"harvestInterval":414,"expiryTime":0,"interval":1066,"id":"cV2oy8mq2vSZA_3aAAAC","name":"jdss"}
    let userInput = prompt("Please enter input:");
    // Displaying the input in an alert
    if (userInput !== null && userInput !== "") {
        console.log("user Input", typeof userInput, userInput)
        data = JSON.parse(JSON.parse(userInput))
        console.log("parsed_data", data)
    }
    if(!executed_set_params) {
        socket.emit("set-required-params", {round_name: "dummy-round"})
    }
    
    socket.emit("server-submit-harvest", data)
})

document.getElementById("resource-sold").addEventListener("click", () => {
    let data = {"index":"2","price":10,"friend_id":"cV2oy8mq2vSZA_3aAAAC","harvest":"farm","my-id":"cV2oy8mq2vSZA_3aAAAC","yield":1,"my-name":"jdss","id":"cV2oy8mq2vSZA_3aAAAC","name":"jdss"}
    let userInput = prompt("Please enter input:");
    // Displaying the input in an alert
    if (userInput !== null && userInput !== "") {
        console.log("user Input", typeof userInput, userInput)
        data = JSON.parse(JSON.parse(userInput))
        console.log("parsed_data", data)
    }
    if(!executed_set_params) {
        socket.emit("set-required-params", {round_name: "dummy-round"})
    }
    socket.emit("trade-good-with-friends", data)
})

document.getElementById("offer-accepted").addEventListener("click", () => {
    let data = {"index":0,"decline":0,"name":"jdss","id":"cV2oy8mq2vSZA_3aAAAC"}
    let userInput = prompt("Please enter input:");
    // Displaying the input in an alert
    if (userInput !== null && userInput !== "") {
        console.log("user Input", typeof userInput, userInput)
        data = JSON.parse(JSON.parse(userInput))
        console.log("parsed_data", data)
    }
    if(!executed_set_params) {
        socket.emit("set-required-params", {round_name: "dummy-round"})
    }
    socket.emit("offer-accepted", data)
})

document.getElementById("generate-offer").addEventListener("click", () => {
    let data = {"generate-offer": "dummy_user", "weeks":5,"harvest":"farm","quantity":1,"credits":300,"index":1,"decline":0,"status":"pending","user_id":"cV2oy8mq2vSZA_3aAAAC","name":"jdss","id":"cV2oy8mq2vSZA_3aAAAC"}
    let userInput = prompt("Please enter input:");
    // Displaying the input in an alert
    if (userInput !== null && userInput !== "") {
        console.log("user Input", typeof userInput, userInput)
        data = JSON.parse(JSON.parse(userInput))
        console.log("parsed_data", data)
    }
    if(!executed_set_params) {
        socket.emit("set-required-params", {round_name: "dummy-round"})
    }
    socket.emit("generate-offer", data)
})


document.getElementById("deliver-offer").addEventListener("click", () => {
    let data = {"weeks":5,"harvest":"farm","quantity":1,"credits":300,"index":0,"decline":0,"status":"complete","user_id":"cV2oy8mq2vSZA_3aAAAC","name":"jdss","id":"cV2oy8mq2vSZA_3aAAAC","expiryTime":78,"percent":54.11764705882326,"interval":1603}
    let userInput = prompt("Please enter input:");
    // Displaying the input in an alert
    if (userInput !== null && userInput !== "") {
        console.log("user Input", typeof userInput, userInput)
        data = JSON.parse(JSON.parse(userInput))
        console.log("parsed_data", data)
    }
    if(!executed_set_params) {
        socket.emit("set-required-params", {round_name: "dummy-round"})
    }
    console.log("dataaaa", data)
    socket.emit("server-deliver-offer", data)
})


document.getElementById("expiry-offer").addEventListener("click", () => {
    let data = {"weeks":4,"harvest":"lake","quantity":1,"credits":400,"index":0,"decline":0,"status":"closed","user_id":"cV2oy8mq2vSZA_3aAAAC","name":"jdss","id":"cV2oy8mq2vSZA_3aAAAC","expiryTime":143,"percent":-0.7042253521123278,"interval":1942}
    let userInput = prompt("Please enter input:");
    // Displaying the input in an alert
    if (userInput !== null && userInput !== "") {
        console.log("user Input", typeof userInput, userInput)
        data = JSON.parse(JSON.parse(userInput))
        console.log("parsed_data", data)
    }
    if(!executed_set_params) {
        socket.emit("set-required-params", {round_name: "dummy-round"})
    }
    socket.emit("offer-timed-out", data)
})


document.getElementById("resource-purchase").addEventListener("click", () => {
    let data = {"index":2,"price":1,"harvestName":"forest","friend_id":"PpVJwAK35ImsZe-3AAAF","my_id":"9pm1lCMZNvqMzlACAAAE","id":"9pm1lCMZNvqMzlACAAAE","name":"player1"}
    let userInput = prompt("Please enter input:");
    // Displaying the input in an alert
    if (userInput !== null && userInput !== "") {
        console.log("user Input", typeof userInput, userInput)
        data = JSON.parse(JSON.parse(userInput))
        console.log("parsed_data", data)
    }
    if(!executed_set_params) {
        socket.emit("set-required-params", {round_name: "dummy-round"})
    }
    socket.emit("server-trade-accepted", data)
})


//still not done
document.getElementById("resource-delivered").addEventListener("click", () => {
    let data = {"index":2,"price":1,"harvestName":"forest","friend_id":"PpVJwAK35ImsZe-3AAAF","my_id":"9pm1lCMZNvqMzlACAAAE","id":"9pm1lCMZNvqMzlACAAAE","name":"player1"}
    let userInput = prompt("Please enter input:");
    // Displaying the input in an alert
    if (userInput !== null && userInput !== "") {
        console.log("user Input", typeof userInput, userInput)
        data = JSON.parse(JSON.parse(userInput))
        console.log("parsed_data", data)
    }
    if(!executed_set_params) {
        socket.emit("set-required-params", {round_name: "dummy-round"})
    }
    socket.emit("server-trade-accepted", data)
})


//still not done
document.getElementById("node-interaction").addEventListener("click", () => {
    let data = {"harvestName":"farm","price":100}
    let userInput = prompt("Please enter input:");
    // Displaying the input in an alert
    if (userInput !== null && userInput !== "") {
        console.log("user Input", typeof userInput, userInput)
        data = JSON.parse(JSON.parse(userInput))
        console.log("parsed_data", data)
    }
    if(!executed_set_params) {
        socket.emit("set-required-params", {round_name: "dummy-round"})
    }
    socket.emit("node-interaction", data)
})


//still not done
document.getElementById("resource-generated").addEventListener("click", () => {
    let data = {"harvestName":"farm","expiration":10}
    let userInput = prompt("Please enter input:");
    // Displaying the input in an alert
    if (userInput !== null && userInput !== "") {
        console.log("user Input", typeof userInput, userInput)
        data = JSON.parse(JSON.parse(userInput))
        console.log("parsed_data", data)
    }
    if(!executed_set_params) {
        socket.emit("set-required-params", {round_name: "dummy-round"})
    }
    socket.emit("resource-generated", data)
})



// document.getElementById("days-event").addEventListener("click", () => {
//     console.log("camehere")
//     socket.emit("server-create-game", {user_id: "testinguser", round_name: "testing_round"})
// })