<pre>

<?php

  $i = 2;
  while ($i <= 31) {

    echo "
      ElseIf Target.Row = $i And Target.Column = 2 Then\n\tRange(\"B$i\").Value = Range(\"B$i\").Value + 1\n
      ElseIf Target.Row = $i And Target.Column = 3 Then\n\tRange(\"C$i\").Value = Range(\"C$i\").Value + 1\n
      ElseIf Target.Row = $i And Target.Column = 4 Then\n\tRange(\"D$i\").Value = Range(\"D$i\").Value + 1\n
      ElseIf Target.Row = $i And Target.Column = 5 Then\n\tRange(\"E$i\").Value = Range(\"E$i\").Value + 1\n
      ElseIf Target.Row = $i And Target.Column = 6 Then\n\tRange(\"F$i\").Value = Range(\"F$i\").Value + 1\n\n";
    $i++;
  }
 ?>

 </pre>