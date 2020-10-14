select machine_id, ts, value
from (
	select *, to_timestamp(timestamp/1000) at time zone 'America/New_York' as ts
	from machine_state
	where value != 'UNAVAILABLE'
	order by timestamp desc
) t
where property = 'execution'
