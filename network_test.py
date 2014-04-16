from networkx import *
import networkx as nx
import matplotlib.pyplot as plt
def read_to_list(filename):
	f = open(filename, 'rb')
	eagelist = list()
	for x in f.readlines():
		a = x.decode('utf-8').strip()
		t = tuple(a.split(','))
		eagelist.append(t)
	return eagelist

def test1():
	f = open('Results/relation_top5.csv', 'rb')
	G = nx.read_adjlist(f, delimiter = ',')
	x = nx.pagerank(G, alpha = 0.9)
	sort_x = sorted(x.items(), key=lambda item: item[1], reverse=True)
	for a1, a2 in sort_x:
		print(str(a1) + ' : ' + str(a2))

def test2():
	G = nx.DiGraph()
	e_list = read_to_list('Results/relation_top5.csv')
	G.add_edges_from(e_list)
	G1 = nx.Graph(G)
	# print(G.degree('2013835867'))
	# print(type(clustering(G1)))
	dict_x = clustering(G1)
	sort_x = sorted(dict_x.items(), key=lambda item: item[1], reverse=True)

	for x, y in sort_x:
		print(' : '.join([str(x), str(y)]))
	# print(G.edges('2013835867'))
	# nx.draw(G,pos=nx.spring_layout(G)) # use spring layout
	# plt.draw()
def test3():
	f = open('Test.data', 'r')
	fw = open('tt', 'w')
	for x in f.readlines():
		fw.write(x.replace(',', ' '))
	fw.close()
	f.close()

if __name__ == '__main__':
	test2()