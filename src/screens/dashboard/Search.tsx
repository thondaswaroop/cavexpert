import React, { useCallback, useState, useMemo } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';
import CommonHeader from '../../components/Header';
import { globalStyles } from '../../Resources';
import { httpService } from '../../services/api/Api';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

interface Topic {
  title: string; // Adjust based on your actual structure
}

interface Category {
  id: string; // Or number, based on your API
  name: string;
  topics: Topic[];
}

const Search = () => {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]); // Changed to hold multiple expanded IDs
  const [error, setError] = useState<string | null>(null);

  const onScreenFocus = useCallback(() => {
    loadCategories();
  }, []);

  useFocusEffect(onScreenFocus);

  const loadCategories = async () => {
    try {
      const result: any = await httpService.get('categories');
      console.log('API response:', result);

      if (result.status && Array.isArray(result.categories)) {
        const mainArray: Category[] = await Promise.all(
          result.categories.map(async (category: any) => {
            const topicData: any = await httpService.post('topics', { category: category.id });
            const topics = Array.isArray(topicData.topics) ? topicData.topics : [];
            return { id: category.id, name: category.title, topics };
          })
        );
        setCategories(mainArray);

        // Set all category IDs as expanded by default
        const allCategoryIds = mainArray.map(category => category.id);
        setExpandedIds(allCategoryIds);
      } else {
        console.error('Unexpected API response:', result);
      }
    } catch (error) {
      console.error('Error loading categories and topics:', error);
      setError('Failed to load categories. Please try again later.');
    }
  };

  const handleSearch = (text: string) => {
    setQuery(text);
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category: Category) =>
      category.name.toLowerCase().includes(query.toLowerCase()) ||
      category.topics.some((topic: Topic) =>
        typeof topic === 'string' ? topic.toLowerCase().includes(query.toLowerCase()) : topic.title.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [categories, query]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prevIds) => 
      prevIds.includes(id) ? prevIds.filter((expandId) => expandId !== id) : [...prevIds, id]
    );
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <View style={styles.categoryContainer}>
      <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.categoryHeader}>
        <Text style={styles.categoryName}>{item.name}</Text>
      </TouchableOpacity>

      {expandedIds.includes(item.id) && ( // Change to check against expandedIds
        <View style={styles.topicsContainer}>
          {item.topics.length > 0 ? (
            item.topics.map((topic: any, index: number) => (
              <Text key={index} style={styles.topicItem}>
                {typeof topic === 'string' ? topic : topic.title}
              </Text>
            ))
          ) : (
            <Text style={styles.topicItem}>No topics available</Text>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={globalStyles.mainContainer}>
      <CommonHeader />
      <View style={globalStyles.padding}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={query}
          onChangeText={handleSearch}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        {filteredCategories.length === 0 ? (
          <Text style={styles.noResultsText}>No results found</Text>
        ) : (
          <FlatList
            data={filteredCategories}
            keyExtractor={(item: Category) => item.id.toString()}
            renderItem={renderCategory}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    backgroundColor: "white",
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#000',
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 5,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  topicsContainer: {
    marginTop: 5,
    marginStart: 10
  },
  topicItem: {
    fontSize: 14,
    marginBottom: 5,
  },
  categoryHeader: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  noResultsText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Search;

