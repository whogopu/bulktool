#!/bin/bash
# exec 3>&1 4>&2
# trap 'exec 2>&4 1>&3' 0 1 2 3
# exec 1>log.out 2>&1

cd /home/gopal/projects/my/bulktool/results
NOW=$(date +"%Y-%m-%d")
echo -e "Started at $NOW"
for d in */ ; do
    echo -e "\nprocessing $d"

    IFS='-' read -ra ADDR <<< "$d"
    arraylength=${#ADDR[@]}

    # for (( i=0; i<${arraylength}; i++ ));
    # do
    #   echo "index: $i, value: ${ADDR[$i]}"
    # done

    DATE_DIFF="$((($(date -d "$NOW" "+%s") - $(date -d "${ADDR[1]}-${ADDR[2]}-${ADDR[3]}" "+%s")) / 86400))"
    # echo "$DATE_DIFF"
   
    if [ $DATE_DIFF -gt 30 ]
    then
      echo "Delete it - $d"
      rm -rf "$d"
    elif [ $DATE_DIFF -gt 8 ]
    then
      echo "Delete the json files"
      rm -rf "$d/json"
    else
      echo "Retain it"
    fi
done
echo -e "\nDone !! \n"
