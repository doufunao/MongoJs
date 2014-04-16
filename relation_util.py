'''
失独
2013835867,408
2807577540,302
2732096711,114
1246025491,94
1614274951,86
'''
from itertools import combinations
import pprint
import sys
import functools
import os
import operator
class relation_class:
	def __init__(self, filepwd):
		self.filepwd = filepwd
		self.relation_list = self.__load_file()

	def __load_file(self):
		filepwd = self.filepwd
		relation_list = list()
		f = open(filepwd, 'rb')
		for l in f:
			string = l.decode('utf-8')
			relation_list.append(tuple(string.split(',')))
		f.close()
		return relation_list

	def __get_end_list(self, u_id):
		end_set = set()
		relation_list = self.__load_file()
		for x in relation_list:
			if int(x[0]) == int(u_id):
				end_set.add(int(x[1]))
		return end_set 

	def find_co_end(self, first_id, second_id):
		relation_list = self.relation_list
		id1 = first_id
		id2 = second_id
		id1_set = set()
		id2_set = set()		
		
		for t in relation_list:
			if int(t[0]) == int(id1):
				id1_set.add(int(t[1]))
			elif int(t[0]) == int(id2):
				id2_set.add(int(t[1]))

		co_set = set()
		co_set = id1_set & id2_set
		return co_set
	
	def find_mutil_co_end(self, id_list):
		combine_list = combinations(id_list, 2)
		result_list = list()
		for t in combine_list:
			result_list.append([t, self.find_co_end(t[0],t[1])])
		return result_list

	def find_cos_end(self, id_list, co_num):
		combine_list = combinations(id_list, co_num)
		result_list = list()
		result_set = set()
		for i in combine_list:
			c_list = self.find_mutil_co_end(list(i))

			if len(c_list) == 1:
				result_set.update(c_list[0][1])
				result_list.append([i, len(result_set), result_set])
			elif len(c_list) > 1:
				b_list = list()
				for a, b in c_list:
					b_list.append(b)
				result_set = functools.reduce(lambda x, e: x & e ,b_list)
				# print(len(result_set))
				result_list.append([i, len(result_set), result_set])

		return result_list


if __name__ == '__main__':
	rc = relation_class('Results/relation_top20.csv')
	id_list = [2732096711,2807577540,2013835867,1246025491,1614274951, 247180716, 3481079677, 1235313783, 2526688941, 2806620574, 3680148261, 3905382393,3872563974, 1915268521, 1644325804, 3972288151, 1913712512, 1565281767, 1421087044, 2476713901]
	# print(repr(rc.find_mutil_co_end([2732096711,2807577540,2013835867,1246025491,1614274951])))
	# print(repr(rc.find_co_end(2732096711,2807577540)))
	# num = int(sys.argv[1])
	# pprint.pprint(rc.find_cos_end(id_list, num))
	for num in range(1,21):
		filepwd = '/'.join([os.getcwd(), 'co_follow_' + str(num) + '_top_20'])
		new_list = sorted(rc.find_cos_end(id_list, num), key = operator.itemgetter(1), reverse = True)
		f = open(filepwd, 'wb')
		for t in new_list:
			f.write(repr(t).encode('utf-8'))
			f.write('\n'.encode('utf-8'))
		f.close()
		