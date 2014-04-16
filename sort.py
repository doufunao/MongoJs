


l = [1,2,3,2,4,3,5,6,3,2,3,4,5]
d = {}
for x in l:
	if x in d:
		d[x] = d[x] + 1
	else:
		d[x] = 0

for k, v in d.items():
	print(k)
	print(v)