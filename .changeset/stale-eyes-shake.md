---
'mow-registry': patch
---

Add hacky workaround to ensure road-marking and traffic-light concepts can be correctly consumed:
- Addition of a `zonality` relationship to road-marking and traffic-light concepts
- Give new road-marking and traffic-light concepts a default zonality of 'non-zonal'
