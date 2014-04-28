import re
import os
def __delimiter_pos(string):
	pattern = re.compile(r'\d+\,?')
	return pattern.search(string).end()

def __parse_string(string):
	pos = int(__delimiter_pos(string))
	user_id = string[:pos-1]
	content = string[pos:]
	return {'user_id': user_id, 'content': content}

def __parse_strings(strings):
	dic_list = list()
	for string in strings:
		c_dict = __parse_string(string)
		dic_list.append(c_dict)
		del c_dict
	return dic_list

def __file_to_strings(in_file_pwd):
	strings = list()
	for line in open(in_file_pwd, 'rb').readlines():
		line = line.decode('utf-8')
		strings.append(line)
	return strings

def __strings_to_file(strings, out_dir_pwd):
	dic_list = __parse_strings(strings)
	for dic in dic_list:
		user_id = dic['user_id']
		content = dic['content']
		out_file_pwd = '/'.join([out_dir_pwd, str(user_id) + '.content'])
		f = open(out_file_pwd, 'wb')
		f.write(content.encode('utf-8'))
		f.close()

def content_file_analyser(in_file_pwd, out_dir_pwd):
	strings = __file_to_strings(in_file_pwd)
	__strings_to_file(strings, out_dir_pwd)

if __name__ == '__main__':
	cur_pwd = os.getcwd()
	in_file_name = 'out.content'
	out_dir_name = 'Results/out_contents'
	in_file_pwd = '/'.join([cur_pwd, in_file_name])
	out_dir_pwd = '/'.join([cur_pwd, out_dir_name])
	content_file_analyser(in_file_pwd, out_dir_pwd)