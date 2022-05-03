#!/bin/bash
# exec 3>&1 4>&2
# trap 'exec 2>&4 1>&3' 0 1 2 3
# exec 1>log.out 2>&1

base="/home/gopal/projects/my/bulktool/results"
cd "$base"
NOW=$(date +"%Y-%m-%d")
echo -e "Started at $NOW"
for d in */ ; do
    echo -e "\nprocessing $d folder"

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
      echo "Deleting the folder"
      rm -rf "$d"
    elif [ $DATE_DIFF -gt 8 ]
    then
      echo "Deleting the json files of folder"
      rm -rf "$d/json"
    else
      echo "Can Retain the folder - Now checking median file"
      # cd "$base/$d"
      # count=$(ls | wc -l)
      # if [ $count -gt 1 ]
      # then
      #   echo "This folder has median files - Retaining this directory"
      # elif [ $DATE_DIFF -gt 0 ]
      # then
      #   echo "This folder is older than 1 day and not having median files - remove this directory"
      #   cd "$base"
      #   rm -rf "$d"
      # else
      #   echo "It is todays' folder - ignoring it"
      # fi
    fi
done
echo -e "\nDone !! \n"
