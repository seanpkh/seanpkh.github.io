(* Content-type: application/vnd.wolfram.cdf.text *)

(*** Wolfram CDF File ***)
(* http://www.wolfram.com/cdf *)

(* CreatedBy='Mathematica 11.0' *)

(*************************************************************************)
(*                                                                       *)
(*  The Mathematica License under which this file was created prohibits  *)
(*  restricting third parties in receipt of this file from republishing  *)
(*  or redistributing it by any means, including but not limited to      *)
(*  rights management or terms of use, without the express consent of    *)
(*  Wolfram Research, Inc. For additional information concerning CDF     *)
(*  licensing and redistribution see:                                    *)
(*                                                                       *)
(*        www.wolfram.com/cdf/adopting-cdf/licensing-options.html        *)
(*                                                                       *)
(*************************************************************************)

(*CacheID: 234*)
(* Internal cache information:
NotebookFileLineBreakTest
NotebookFileLineBreakTest
NotebookDataPosition[      1064,         20]
NotebookDataLength[     25712,        557]
NotebookOptionsPosition[     26276,        553]
NotebookOutlinePosition[     26716,        572]
CellTagsIndexPosition[     26673,        569]
WindowFrame->Normal*)

(* Beginning of Notebook Content *)
Notebook[{
Cell[BoxData[
 DynamicModuleBox[{$CellContext`pointList$$ = {}, $CellContext`curPoly$$ = \
-$CellContext`t + $CellContext`z^2, $CellContext`a00$$ = 
  0, $CellContext`a01$$ = -1, $CellContext`a02$$ = 0, $CellContext`a10$$ = 
  0, $CellContext`a11$$ = 0, $CellContext`a12$$ = 0, $CellContext`a20$$ = 
  1, $CellContext`a21$$ = 0, $CellContext`a22$$ = 0, $CellContext`a30$$ = 
  0, $CellContext`a31$$ = 0, $CellContext`a32$$ = 0, $CellContext`a40$$ = 
  0, $CellContext`a41$$ = 0, $CellContext`a42$$ = 0, $CellContext`a50$$ = 
  0, $CellContext`a51$$ = 0, $CellContext`a52$$ = 
  0, $CellContext`coeffRange$$ = {-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 
  5}, $CellContext`degree$$ = 2, $CellContext`plottedRamPoints$$ = Text[
   Style["X", Medium, Bold, 
    RGBColor[1, 0, 0]], {0, 
   0}], $CellContext`rootLists$$ = {{}, {}}, $CellContext`rootColors$$ = {
   RGBColor[0.368417, 0.506779, 0.709798], 
   RGBColor[
   0.880722, 0.611041, 0.142051]}, $CellContext`parameterRange$$ = {{-5, 
  5}, {-5, 5}}, $CellContext`rootRange$$ = {{-5, 5}, {-5, 
  5}}, $CellContext`parameterZoomFactor$$ = 1, $CellContext`rootZoomFactor$$ =
   1, $CellContext`rootDimension$$ = 2, $CellContext`showText$$ = 
  False, $CellContext`showAxes$$ = False, $CellContext`labelRoots$$ = 
  False, $CellContext`rootCollision$$ = False}, 
  TagBox[GridBox[{
     {
      StyleBox["\<\"Instructions: Click and drag to draw a loop in the \
parameter space on the left; the paths followed by the roots of f_t(z) are \
drawn on the right. Avoid the red x's which denote t such that f_t(z) has a \
repeated root. To change the polynomial, click the coefficients then press \
the update button.\\n\"\>",
       StripOnInput->False,
       FontSize->16]},
     {
      StyleBox[
       TemplateBox[{
        "\[ThinSpace]","\" \"",
         "\"Polynomial family (variable z, parameter t):\\nf_t(z)=\"",
         TemplateBox[{"\"(\"", 
           TogglerBox[
            Dynamic[$CellContext`a00$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a00$$, StandardForm]]], "\" + \"", 
           TogglerBox[
            
            Dynamic[$CellContext`a01$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a01$$, StandardForm]]], "\"t + \"", 
           TogglerBox[
            
            Dynamic[$CellContext`a02$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a02$$, StandardForm]]], "\"t^2) + \"", 
           "\"(\"", 
           TogglerBox[
            
            Dynamic[$CellContext`a10$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a10$$, StandardForm]]], "\" + \"", 
           TogglerBox[
            
            Dynamic[$CellContext`a11$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a11$$, StandardForm]]], "\"t + \"", 
           TogglerBox[
            
            Dynamic[$CellContext`a12$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a12$$, StandardForm]]], "\"t^2)z^1 +\"", 
           "\"(\"", 
           TogglerBox[
            
            Dynamic[$CellContext`a20$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a20$$, StandardForm]]], "\" + \"", 
           TogglerBox[
            
            Dynamic[$CellContext`a21$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a21$$, StandardForm]]], "\"t + \"", 
           TogglerBox[
            
            Dynamic[$CellContext`a22$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a22$$, StandardForm]]], "\"t^2)z^2 +\"", 
           "\"(\"", 
           TogglerBox[
            
            Dynamic[$CellContext`a30$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a30$$, StandardForm]]], "\" + \"", 
           TogglerBox[
            
            Dynamic[$CellContext`a31$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a31$$, StandardForm]]], "\"t + \"", 
           TogglerBox[
            
            Dynamic[$CellContext`a32$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a32$$, StandardForm]]], "\"t^2)z^3 +\"", 
           "\"(\"", 
           TogglerBox[
            
            Dynamic[$CellContext`a40$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a40$$, StandardForm]]], "\" + \"", 
           TogglerBox[
            
            Dynamic[$CellContext`a41$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a41$$, StandardForm]]], "\"t + \"", 
           TogglerBox[
            
            Dynamic[$CellContext`a42$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a42$$, StandardForm]]], "\"t^2)z^4 +\"", 
           "\"(\"", 
           TogglerBox[
            
            Dynamic[$CellContext`a50$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a50$$, StandardForm]]], "\" + \"", 
           TogglerBox[
            
            Dynamic[$CellContext`a51$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a51$$, StandardForm]]], "\"t + \"", 
           TogglerBox[
            
            Dynamic[$CellContext`a52$$], {-5 -> RowBox[{"-", "5"}], -4 -> 
             RowBox[{"-", "4"}], -3 -> RowBox[{"-", "3"}], -2 -> 
             RowBox[{"-", "2"}], -1 -> RowBox[{"-", "1"}], 0 -> "0", 1 -> "1",
              2 -> "2", 3 -> "3", 4 -> "4", 5 -> "5"}, 
            DynamicBox[
             ToBoxes[$CellContext`a52$$, StandardForm]]], "\"t^2)z^5\""}, 
          "RowDefault"]},
        "RowWithSeparators"],
       StripOnInput->False,
       FontSize->14]},
     {
      StyleBox[
       TemplateBox[{"\"Simplified, f_t(z)=\"",DynamicBox[
          
          ToBoxes[($CellContext`a00$$ + $CellContext`a01$$ $CellContext`t + \
$CellContext`a02$$ $CellContext`t^2) + ($CellContext`a10$$ + \
$CellContext`a11$$ $CellContext`t + $CellContext`a12$$ $CellContext`t^2) \
$CellContext`z + ($CellContext`a20$$ + $CellContext`a21$$ $CellContext`t + \
$CellContext`a22$$ $CellContext`t^2) $CellContext`z^2 + ($CellContext`a30$$ + \
$CellContext`a31$$ $CellContext`t + $CellContext`a32$$ $CellContext`t^2) \
$CellContext`z^3 + ($CellContext`a40$$ + $CellContext`a41$$ $CellContext`t + \
$CellContext`a42$$ $CellContext`t^2) $CellContext`z^4 + ($CellContext`a50$$ + \
$CellContext`a51$$ $CellContext`t + $CellContext`a52$$ $CellContext`t^2) \
$CellContext`z^5, StandardForm]],"\".\"",ButtonBox[
         "\"Update polynomial family\"", 
          ButtonFunction :> ($CellContext`inputPolynomial = \
($CellContext`a00$$ + $CellContext`a01$$ $CellContext`t + $CellContext`a02$$ \
$CellContext`t^2) + ($CellContext`a10$$ + $CellContext`a11$$ $CellContext`t + \
$CellContext`a12$$ $CellContext`t^2) $CellContext`z + ($CellContext`a20$$ + \
$CellContext`a21$$ $CellContext`t + $CellContext`a22$$ $CellContext`t^2) \
$CellContext`z^2 + ($CellContext`a30$$ + $CellContext`a31$$ $CellContext`t + \
$CellContext`a32$$ $CellContext`t^2) $CellContext`z^3 + ($CellContext`a40$$ + \
$CellContext`a41$$ $CellContext`t + $CellContext`a42$$ $CellContext`t^2) \
$CellContext`z^4 + ($CellContext`a50$$ + $CellContext`a51$$ $CellContext`t + \
$CellContext`a52$$ $CellContext`t^2) $CellContext`z^5; $CellContext`curPoly$$ = \
$CellContext`inputPolynomial; $CellContext`degree$$ = 
            Exponent[$CellContext`curPoly$$, $CellContext`z]; \
$CellContext`pointList$$ = {}; $CellContext`rootLists$$ = 
            Table[{}, $CellContext`degree$$]; $CellContext`rootColors$$ = Take[
              ColorData[
              97, "ColorList"], $CellContext`degree$$]; \
$CellContext`cRamPoints = 
            Solve[Discriminant[$CellContext`curPoly$$, $CellContext`z] == 
              0, $CellContext`t]; 
           If[Length[$CellContext`cRamPoints] >= 
             1, $CellContext`ramPoints = ReplaceAll[{
                 Re[$CellContext`t], 
                 
                 Im[$CellContext`t]}, $CellContext`cRamPoints]; \
$CellContext`plottedRamPoints$$ = Map[Text[
                 Style["X", Medium, Bold, Red], #]& , $CellContext`ramPoints]; 
             Null, $CellContext`plottedRamPoints$$ = {}]), Appearance -> 
          Automatic, Evaluator -> Automatic, Method -> "Preemptive"]},
        "RowDefault"],
       StripOnInput->False,
       FontSize->14]},
     {
      TemplateBox[{TemplateBox[{
          StyleBox[
          "\"Show values: \"", FontFamily -> "Roboto", FontSize -> 20, 
           StripOnInput -> False], 
          CheckboxBox[
           Dynamic[$CellContext`showText$$]]}, "RowDefault"],TemplateBox[{
          StyleBox[
          "\"      Number roots: \"", FontFamily -> "Roboto", FontSize -> 20, 
           StripOnInput -> False], 
          CheckboxBox[
           Dynamic[$CellContext`labelRoots$$]]}, "RowDefault"],TemplateBox[{
          StyleBox[
          "\"      Show axes: \"", FontFamily -> "Roboto", FontSize -> 20, 
           StripOnInput -> False], 
          CheckboxBox[
           Dynamic[$CellContext`showAxes$$]]}, "RowDefault"],StyleBox[
         TemplateBox[{"\"      Root display type: \"", 
           InterpretationBox[
            StyleBox[
             GridBox[{{
                SetterBox[
                 Dynamic[$CellContext`rootDimension$$], {2}, "\"Loops\""], 
                SetterBox[
                 Dynamic[$CellContext`rootDimension$$], {3}, "\"Braids\""]}}, 
              ColumnSpacings -> 0, BaselinePosition -> {1, 1}], Deployed -> 
             True], 
            SetterBar[
             Dynamic[$CellContext`rootDimension$$], {
             2 -> "Loops", 3 -> "Braids"}]]}, "RowDefault"], FontFamily -> 
         "Roboto", FontSize -> 20, StripOnInput -> False]},
       "RowDefault"]},
     {
      DynamicBox[ToBoxes[
        If[$CellContext`rootCollision$$ == True, 
         Style[
         "STATUS: ROOT COLLISION; RESTART LOOP\n", FontColor -> Red, 
          FontFamily -> "Roboto", FontWeight -> Bold, FontSize -> 20], 
         Style[
         "STATUS: WORKING PROPERLY, DRAW SOME LOOPS IN THE t-PARAMETER SPACE \
ON THE LEFT! \n", FontFamily -> "Roboto", FontWeight -> Bold, FontSize -> 
          20]], StandardForm],
       ImageSizeCache->{891., {35., 19.}}]},
     {
      TagBox[GridBox[{
         {
          TagBox[GridBox[{
             {
              TagBox[
               DynamicBox[ToBoxes[
                 Graphics[{$CellContext`plottedRamPoints$$, 
                   $CellContext`ColorArrowDraw[$CellContext`pointList$$, 
                    Black]}, ImageSize -> Large, 
                  PlotRange -> $CellContext`parameterZoomFactor$$ \
$CellContext`parameterRange$$, Axes -> $CellContext`showAxes$$, GridLines -> 
                  Automatic], StandardForm],
                ImageSizeCache->{576., {285., 291.}}],
               
               EventHandlerTag[{
                "MouseDown" :> ($CellContext`curPoint = 
                   MousePosition[
                    "Graphics"]; $CellContext`pointList$$ = \
{$CellContext`curPoint}; $CellContext`curRoots = \
$CellContext`ComputeRoots[$CellContext`curPoint, $CellContext`curPoly$$]; \
$CellContext`rootLists$$ = 
                   Map[{#}& , $CellContext`curRoots]; \
$CellContext`rootCollision$$ = False; Null), "MouseDragged" :> 
                 If[Length[$CellContext`pointList$$] > 
                   0, $CellContext`curPoint = MousePosition["Graphics"]; 
                   AppendTo[$CellContext`pointList$$, $CellContext`curPoint]; \
$CellContext`curRoots = $CellContext`ComputeRoots[$CellContext`curPoint, \
$CellContext`curPoly$$]; $CellContext`collisionTest = {}; 
                   If[Length[$CellContext`curRoots] == $CellContext`degree$$, 
                    For[$CellContext`j = 
                    1, $CellContext`j <= $CellContext`degree$$, 
                    Increment[$CellContext`j], $CellContext`nearestRoot = Part[
                    Nearest[$CellContext`curRoots, 
                    Last[
                    Part[$CellContext`rootLists$$, $CellContext`j]]], 1]; 
                    AppendTo[
                    
                    Part[$CellContext`rootLists$$, $CellContext`j], \
$CellContext`nearestRoot]; 
                    AppendTo[$CellContext`collisionTest, \
$CellContext`nearestRoot]; Null] 
                    If[Signature[$CellContext`collisionTest] == 
                    0, $CellContext`rootCollision$$ = True]]], Method -> 
                 "Preemptive", PassEventsDown -> Automatic, PassEventsUp -> 
                 True}]]},
             {
              TemplateBox[{ButtonBox[
                 StyleBox[
                 "\"Zoom in\"", FontSize -> 20, StripOnInput -> False], 
                 ButtonFunction :> ($CellContext`parameterZoomFactor$$ = 
                  0.8 $CellContext`parameterZoomFactor$$), Appearance -> 
                 Automatic, Evaluator -> Automatic, Method -> "Preemptive"],
                ButtonBox[
                 StyleBox[
                 "\"Zoom out\"", FontSize -> 20, StripOnInput -> False], 
                 ButtonFunction :> ($CellContext`parameterZoomFactor$$ = (1/
                    0.8) $CellContext`parameterZoomFactor$$), Appearance -> 
                 Automatic, Evaluator -> Automatic, Method -> "Preemptive"]},
               "RowDefault"]},
             {
              DynamicBox[ToBoxes[
                If[
                 
                 And[$CellContext`pointList$$ != {}, $CellContext`showText$$ == 
                  True], $CellContext`valOft = SetPrecision[Part[
                    Last[$CellContext`pointList$$], 1] + Part[
                    Last[$CellContext`pointList$$], 2] I, 3]; Style[
                   Column[{
                    Row[{"t=", $CellContext`valOft}], 
                    Row[{
                    Subscript["f", "t"], "(z)=", 
                    
                    ReplaceAll[$CellContext`curPoly$$, $CellContext`t -> \
$CellContext`valOft]}]}], FontFamily -> "Roboto", FontWeight -> Bold, 
                   FontSize -> 20], " "], StandardForm],
               ImageSizeCache->{7., {1., 6.}}]}
            },
            DefaultBaseStyle->"Column",
            GridBoxAlignment->{"Columns" -> {{Center}}},
            
            GridBoxItemSize->{
             "Columns" -> {{Automatic}}, "Rows" -> {{Automatic}}}],
           "Column"], 
          TagBox[GridBox[{
             {
              DynamicBox[ToBoxes[If[$CellContext`rootDimension$$ == 2, 
                  Graphics[
                   Table[{
                    $CellContext`ColorArrowDraw[
                    Part[$CellContext`rootLists$$, $CellContext`i], 
                    Part[$CellContext`rootColors$$, $CellContext`i]], 
                    If[
                    
                    And[$CellContext`labelRoots$$ == 
                    True, $CellContext`pointList$$ != {}], 
                    Text[
                    
                    Style[$CellContext`i, FontColor -> White, FontFamily -> 
                    "Roboto", FontWeight -> Bold, FontSize -> 16], 
                    Part[
                    Part[$CellContext`rootLists$$, $CellContext`i], 
                    1]], {}]}, {$CellContext`i, 1, $CellContext`degree$$}], 
                   ImageSize -> Large, 
                   PlotRange -> $CellContext`rootZoomFactor$$ \
$CellContext`rootRange$$, Axes -> $CellContext`showAxes$$, GridLines -> 
                   Automatic], ""] If[$CellContext`rootDimension$$ == 3, 
                  Graphics3D[
                   Table[{
                    $CellContext`ColorArrowDraw3D[
                    Part[$CellContext`rootLists$$, $CellContext`i], 
                    Part[$CellContext`rootColors$$, $CellContext`i]], 
                    If[
                    
                    And[$CellContext`labelRoots$$ == 
                    True, $CellContext`pointList$$ != {}], 
                    Text[
                    
                    Style[$CellContext`i, FontColor -> Black, FontFamily -> 
                    "Roboto", FontWeight -> Bold, FontSize -> 20], 
                    Append[
                    Part[
                    Part[$CellContext`rootLists$$, $CellContext`i], 1], 
                    0]], {}]}, {$CellContext`i, 1, $CellContext`degree$$}], 
                   ImageSize -> Large, PlotRange -> 
                   Append[$CellContext`rootZoomFactor$$ \
$CellContext`rootRange$$, {-1, 6}], Axes -> $CellContext`showAxes$$], ""], 
                StandardForm],
               ImageSizeCache->{579., {285., 291.}}]},
             {
              TemplateBox[{ButtonBox[
                 StyleBox[
                 "\"Zoom in\"", FontSize -> 20, StripOnInput -> False], 
                 ButtonFunction :> ($CellContext`rootZoomFactor$$ = 
                  0.8 $CellContext`rootZoomFactor$$), Appearance -> Automatic,
                  Evaluator -> Automatic, Method -> "Preemptive"],ButtonBox[
                 StyleBox[
                 "\"Zoom out\"", FontSize -> 20, StripOnInput -> False], 
                 ButtonFunction :> ($CellContext`rootZoomFactor$$ = (1/
                    0.8) $CellContext`rootZoomFactor$$), Appearance -> 
                 Automatic, Evaluator -> Automatic, Method -> "Preemptive"]},
               "RowDefault"]},
             {
              DynamicBox[ToBoxes[
                If[
                 
                 And[$CellContext`pointList$$ != {}, $CellContext`showText$$ == 
                  True], 
                 Column[
                  Map[Style[
                    Row[{
                    Subscript["z", #], "=", 
                    SetPrecision[Part[
                    Last[
                    Part[$CellContext`rootLists$$, #]], 1] + Part[
                    Last[
                    Part[$CellContext`rootLists$$, #]], 2] I, 3]}], FontColor -> 
                    Part[$CellContext`rootColors$$, #], FontFamily -> 
                    "Roboto", FontWeight -> Bold, FontSize -> 20]& , 
                   Range[1, $CellContext`degree$$]]], ""], StandardForm],
               ImageSizeCache->{0., {0., 6.}}]}
            },
            DefaultBaseStyle->"Column",
            GridBoxAlignment->{"Columns" -> {{Center}}},
            
            GridBoxItemSize->{
             "Columns" -> {{Automatic}}, "Rows" -> {{Automatic}}}],
           "Column"]}
        },
        AutoDelete->False,
        GridBoxAlignment->{"Rows" -> {{Top}}},
        GridBoxItemSize->{
         "Columns" -> {{Automatic}}, "Rows" -> {{Automatic}}}],
       "Grid"]}
    },
    DefaultBaseStyle->"Column",
    GridBoxAlignment->{"Columns" -> {{Left}}},
    GridBoxItemSize->{"Columns" -> {{Automatic}}, "Rows" -> {{Automatic}}}],
   "Column"],
  DynamicModuleValues:>{},
  Initialization:>($CellContext`ArrowPartial[
      Pattern[$CellContext`w, 
       Blank[]], 
      Pattern[$CellContext`m, 
       Blank[]], 
      Pattern[$CellContext`color, 
       Blank[]]] := {$CellContext`color, 
      Point[
       Part[$CellContext`w, 1]], 
      Arrow[
       Part[$CellContext`w, 
        Span[1, $CellContext`m]]]}; $CellContext`ColorArrowDraw[
      Pattern[$CellContext`w, 
       Blank[]], 
      Pattern[$CellContext`color, 
       Blank[]]] := 
    Which[Length[$CellContext`w] == 0, {}, Length[$CellContext`w] == 
      1, {$CellContext`color, 
       PointSize[0.03], 
       Point[
        Part[$CellContext`w, 1]]}, Length[$CellContext`w] > 
      1, {$CellContext`color, 
       Thickness[0.007], 
       PointSize[0.03], 
       Point[
        Part[$CellContext`w, 1]], 
       BSplineCurve[$CellContext`w]}]; $CellContext`ColorArrowDraw3D[
      Pattern[$CellContext`w, 
       Blank[]], 
      Pattern[$CellContext`color, 
       Blank[]]] := ($CellContext`list3d = {}; 
     For[$CellContext`k = 1, $CellContext`k <= Length[$CellContext`w], 
       Increment[$CellContext`k], 
       AppendTo[$CellContext`list3d, 
        Append[
         Part[$CellContext`w, $CellContext`k], 
         5 (($CellContext`k - 1)/Length[$CellContext`w])]]]; 
     Which[Length[$CellContext`w] == 0, {}, Length[$CellContext`w] == 
       1, {$CellContext`color, 
        PointSize[0.02], 
        Point[
         Part[$CellContext`list3d, 1]]}, Length[$CellContext`w] > 
       1, {$CellContext`color, 
        Thickness[0.007], 
        PointSize[0.02], 
        Point[
         Part[$CellContext`list3d, 1]], 
        Point[
         Append[
          Part[$CellContext`w, 1], 5 (1 - 1/Length[$CellContext`w])]], 
        BSplineCurve[$CellContext`list3d]}]); $CellContext`ComputeRoots[
      Pattern[$CellContext`parameter, 
       Blank[]], 
      Pattern[$CellContext`poly, 
       Blank[]]] := ($CellContext`subsPoly = 
      ReplaceAll[$CellContext`poly, $CellContext`t -> 
        Part[$CellContext`parameter, 1] + 
         Part[$CellContext`parameter, 2] I]; $CellContext`zList = 
      NSolve[$CellContext`subsPoly == 0, $CellContext`z]; ReplaceAll[{
        Re[$CellContext`z], 
        Im[$CellContext`z]}, $CellContext`zList]))]], "Output"]
},
WindowSize->{1500, 917},
Visible->True,
ScrollingOptions->{"VerticalScrollRange"->Fit},
ShowCellBracket->Automatic,
CellContext->Notebook,
TrackCellChangeTimes->False,
FrontEndVersion->"11.0 for Microsoft Windows (64-bit) (September 21, 2016)",
StyleDefinitions->"Default.nb"
]
(* End of Notebook Content *)

(* Internal cache information *)
(*CellTagsOutline
CellTagsIndex->{}
*)
(*CellTagsIndex
CellTagsIndex->{}
*)
(*NotebookFileOutline
Notebook[{
Cell[1464, 33, 24808, 518, 893, "Output"]
}
]
*)

(* End of internal cache information *)

(* NotebookSignature Ow0ugwfK4jZwRBwGkDizs1XX *)
