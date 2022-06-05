BEGIN;
    -- let 's create a temp table to bulk data into
    create temporary table temp_json
    (values text) on
    commit
    drop;
copy temp_json from 'C:\Sources\bagpipe-devtools\server\api\transport\test.txt';

-- uncomment the line above to insert records into your table
insert into resulta
    ("msg")

select values->>'msg'
as msg
from
(
           select json_array_elements(replace(values,' \ ',' \ \ ')
::json) as values 
           from   temp_json
       ) a;
COMMIT;