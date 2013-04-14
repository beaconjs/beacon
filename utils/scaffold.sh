#!/bin/bash

params=$*

entityName=$1
filename=`echo $entityName | tr [A-Z] [a-z]`

assignments="\n "

for p in $params 
do
    if [ $p != $entityName ]
    then
        if [ ! -z "$methodParams" ]
        then
            methodParams="$methodParams, "
            assignments="$assignments, \n"
        fi

        methodParams="$methodParams$p"
        assignments="$assignments this.$p = $p"
    fi
done

assignments="$assignments,\n this.created_at = new Date(),\n this.modified_at = new Date();"

model="var $entityName = function($methodParams) {$assignments\n};\n\nexports=$entityName;"
echo $model > "$filename.js"
