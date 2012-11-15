

<?php
 

//Generate the HTML Table used in sudoku.html

$html = '';
$count = 0;
$isDark = true;
$id = 0;
$rowMarker =0;
for($i=0; $i<9; $i++){
  $html.= ($i%3) ==0 ? '<tr>' : '';
  $html.='<td class="'. ($isDark ? 'darkCells' : 'lightCells');
  $html.='"><table cellspacing="1" cellpadding="0">';
  for($j=1; $j<4; $j++){
    $html.='<tr>';
    for($k=1; $k<4; $k++){
      $html.='<td class="boardCell">';
      $html.='<div id="'.$count.'" data-row="'. ($rowMarker+$j) .'" ';
      $html.=' data-col="'.((($i%3)*3)+$k).'"';
      $html.=' data-block="'. ($i + 1) . '" class="editValue">';
      $html.='<input></div></td>';
      $count++;
    }
    $html.='</tr>';
  }
  $html.='</table></td>';
  $isDark = !$isDark;
  $isNewBlockRow = ((($i+1)%3) == 0 && $i!=0) ? true : false;
  $html.= $isNewBlockRow ? '</tr>' : '';
  $rowMarker+= $isNewBlockRow ? 3:0;
} 
file_put_contents("output.html", $html);

?>
