import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import CommonHeader from '../../components/Header';
import { globalStyles } from '../../Resources';
import { TextInput } from 'react-native-paper';
import { httpService } from '../../services/api/Api';
import { useNavigation } from '@react-navigation/native';

const Search = () => {
  const [query, setQuery] = useState('');
  const [categoryList, setCategoryList] = useState<any>([]);
  const [filterCategoryList, setFilterCategoryList] = useState<any>([]);
  const navigation: any = useNavigation(); // Navigation hook

  useEffect(() => {
    fetchCategoriesTopics();
  }, []);

  const fetchCategoriesTopics = async () => {
    try {
      const result: any = await httpService.get('topicsAndCategories');
      if (Array.isArray(result.categoriesAndTopics)) {
        setCategoryList(result.categoriesAndTopics);
      } else {
        console.warn('Expected array in categoriesAndTopics:', result);
      }
    } catch (error) {
      console.error('Error fetching categories and topics:', error);
    }
  };

  const handleSearch = (text: string) => {
    setQuery(text);

    if (!text) {
      setFilterCategoryList([]); // Clear the filtered list if search query is empty
      return;
    }

    const filtered = categoryList.reduce((acc: any[], category: any) => {
      const matchingTopics = category.topicsList.filter((topic: any) =>
        topic.title.toLowerCase().includes(text.toLowerCase())
      );

      if (category.title.toLowerCase().includes(text.toLowerCase()) || matchingTopics.length) {
        acc.push({
          ...category,
          topicsList: matchingTopics.length ? matchingTopics : category.topicsList,
        });
      }
      return acc;
    }, []);

    setFilterCategoryList(filtered);
  };

  const selectTopic = (item: any) => {
    console.log('item', item);
    const data = { title: item.title, id: item.id }; // Prepare data for navigation
    navigation.navigate('ViewTopic', data); // Navigate to quiz screen

  }

  const renderTopicItem = ({ item }: any) => (
    <View style={styles.topicItem}>
      <TouchableOpacity onPress={() => selectTopic(item)}>
        <Text style={styles.topicText}>• {item.title}</Text>
      </TouchableOpacity>
    </View >
  );

  const renderCategoryItem = ({ item }: any) => (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryText}>{item.title}</Text>
      <FlatList
        data={item.topicsList}
        keyExtractor={(topic) => topic.id.toString()}
        renderItem={renderTopicItem}
      />
    </View>
  );

  return (
    <View style={[globalStyles.mainContainer, { backgroundColor: '#fff' }]}>
      <CommonHeader />
      <View style={globalStyles.padding}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={query}
          onChangeText={handleSearch}
        />

        {query && filterCategoryList.length > 0 ? (
          <FlatList
            data={filterCategoryList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCategoryItem}
          />
        ) : query ? (
          <View style={globalStyles.textCenter}>
            <Text style={globalStyles.textCenter}>No data found</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    backgroundColor: 'white',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#000',
    marginBottom: 16,
  },
  categoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  topicItem: {
    paddingLeft: 20,
    paddingVertical: 5,
  },
  topicText: {
    fontSize: 16,
    color: '#666',
  },
});

export default Search;
