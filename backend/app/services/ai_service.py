import openai
import json
from flask import current_app
from typing import List, Dict, Any

class AIService:
    """Service for AI-powered resource recommendations using OpenAI."""
    
    def __init__(self):
        self.client = openai
        self.client.api_key = current_app.config.get('OPENAI_API_KEY')
    
    def search_resources(self, query: str, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        Generate AI-powered resource recommendations based on user query and filters.
        
        Args:
            query: User search query
            filters: Search filters (type, difficulty, pricing)
            
        Returns:
            List of resource recommendations
        """
        if not self.client.api_key:
            current_app.logger.warning("OpenAI API key not configured, using fallback results")
            return self._get_fallback_results(query, filters)
        
        try:
            # Build the prompt based on query and filters
            prompt = self._build_search_prompt(query, filters)
            
            # Call OpenAI API
            response = self.client.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert AI assistant that helps students and developers find the best learning resources. You specialize in recommending AI tools, YouTube channels, online courses, and educational websites. Always provide accurate, up-to-date, and relevant recommendations."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=2000,
                temperature=0.7
            )
            
            # Parse the response
            ai_response = response.choices[0].message.content
            resources = self._parse_ai_response(ai_response)
            
            # Add metadata and validate results
            validated_resources = self._validate_and_enhance_resources(resources, query, filters)
            
            return validated_resources
            
        except Exception as e:
            current_app.logger.error(f"OpenAI API error: {str(e)}")
            return self._get_fallback_results(query, filters)
    
    def _build_search_prompt(self, query: str, filters: Dict[str, Any] = None) -> str:
        """Build the search prompt for OpenAI."""
        prompt = f"""Find the best learning resources for: "{query}"

Please provide 8-12 high-quality recommendations including AI tools, YouTube channels, online courses, and educational websites.

"""
        
        if filters:
            if filters.get('type'):
                prompt += f"Focus on: {', '.join(filters['type'])}\n"
            
            if filters.get('difficulty'):
                prompt += f"Difficulty level: {filters['difficulty']}\n"
            
            if filters.get('pricing'):
                if 'free' in filters['pricing']:
                    prompt += "Include free resources\n"
                if 'paid' in filters['pricing']:
                    prompt += "Include premium/paid resources\n"
        
        prompt += """
For each resource, provide the following information in JSON format:
{
  "resources": [
    {
      "name": "Resource Name",
      "description": "Brief description of what this resource offers",
      "type": "tool|youtube|course|website",
      "url": "https://example.com",
      "difficulty": "beginner|intermediate|advanced",
      "pricing": "free|freemium|paid",
      "rating": 4.5,
      "tags": ["tag1", "tag2"],
      "popularity": "high|medium|low"
    }
  ]
}

Make sure all URLs are real and working. Focus on popular, well-known resources with good reputations.
"""
        
        return prompt
    
    def _parse_ai_response(self, response: str) -> List[Dict[str, Any]]:
        """Parse AI response and extract resource data."""
        try:
            # Try to find JSON in the response
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            
            if start_idx != -1 and end_idx != 0:
                json_str = response[start_idx:end_idx]
                data = json.loads(json_str)
                return data.get('resources', [])
            else:
                # Fallback: try to parse the entire response as JSON
                data = json.loads(response)
                return data.get('resources', [])
                
        except (json.JSONDecodeError, KeyError) as e:
            current_app.logger.error(f"Failed to parse AI response: {str(e)}")
            return []
    
    def _validate_and_enhance_resources(self, resources: List[Dict[str, Any]], 
                                       query: str, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Validate and enhance resource data."""
        validated_resources = []
        
        for resource in resources:
            try:
                # Ensure required fields exist
                if not all(key in resource for key in ['name', 'description', 'type', 'url']):
                    continue
                
                # Validate and set defaults
                validated_resource = {
                    'id': len(validated_resources) + 1,
                    'name': resource.get('name', '').strip(),
                    'description': resource.get('description', '').strip(),
                    'type': resource.get('type', 'website').lower(),
                    'url': resource.get('url', '').strip(),
                    'difficulty': resource.get('difficulty', 'intermediate').lower(),
                    'pricing': resource.get('pricing', 'free').lower(),
                    'rating': min(max(float(resource.get('rating', 4.0)), 1.0), 5.0),
                    'tags': resource.get('tags', []),
                    'popularity': resource.get('popularity', 'medium').lower()
                }
                
                # Validate URL format
                if not validated_resource['url'].startswith(('http://', 'https://')):
                    validated_resource['url'] = 'https://' + validated_resource['url']
                
                # Validate type
                valid_types = ['tool', 'youtube', 'course', 'website']
                if validated_resource['type'] not in valid_types:
                    validated_resource['type'] = 'website'
                
                # Validate difficulty
                valid_difficulties = ['beginner', 'intermediate', 'advanced']
                if validated_resource['difficulty'] not in valid_difficulties:
                    validated_resource['difficulty'] = 'intermediate'
                
                # Validate pricing
                valid_pricing = ['free', 'freemium', 'paid']
                if validated_resource['pricing'] not in valid_pricing:
                    validated_resource['pricing'] = 'free'
                
                # Add search relevance score
                validated_resource['relevance_score'] = self._calculate_relevance_score(
                    validated_resource, query, filters
                )
                
                validated_resources.append(validated_resource)
                
            except Exception as e:
                current_app.logger.error(f"Error validating resource: {str(e)}")
                continue
        
        # Sort by relevance score
        validated_resources.sort(key=lambda x: x['relevance_score'], reverse=True)
        
        return validated_resources
    
    def _calculate_relevance_score(self, resource: Dict[str, Any], 
                                  query: str, filters: Dict[str, Any] = None) -> float:
        """Calculate relevance score for a resource."""
        score = resource.get('rating', 4.0)
        
        # Boost score based on popularity
        popularity_boost = {
            'high': 1.2,
            'medium': 1.0,
            'low': 0.8
        }
        score *= popularity_boost.get(resource.get('popularity', 'medium'), 1.0)
        
        # Boost score if matches filters
        if filters:
            if filters.get('type') and resource.get('type') in filters['type']:
                score *= 1.1
            
            if filters.get('difficulty') and resource.get('difficulty') == filters['difficulty']:
                score *= 1.1
            
            if filters.get('pricing') and resource.get('pricing') in filters['pricing']:
                score *= 1.1
        
        # Simple keyword matching boost
        query_words = query.lower().split()
        resource_text = f"{resource.get('name', '')} {resource.get('description', '')}".lower()
        
        keyword_matches = sum(1 for word in query_words if word in resource_text)
        if keyword_matches > 0:
            score *= (1 + keyword_matches * 0.1)
        
        return min(score, 5.0)
    
    def _get_fallback_results(self, query: str, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Provide fallback results when AI service is unavailable."""
        fallback_resources = [
            {
                'id': 1,
                'name': 'GitHub',
                'description': 'World\'s largest code repository and collaboration platform',
                'type': 'tool',
                'url': 'https://github.com',
                'difficulty': 'beginner',
                'pricing': 'freemium',
                'rating': 4.8,
                'tags': ['coding', 'collaboration', 'open-source'],
                'popularity': 'high',
                'relevance_score': 4.8
            },
            {
                'id': 2,
                'name': 'freeCodeCamp',
                'description': 'Learn to code for free with interactive lessons',
                'type': 'course',
                'url': 'https://freecodecamp.org',
                'difficulty': 'beginner',
                'pricing': 'free',
                'rating': 4.7,
                'tags': ['web-development', 'programming', 'certification'],
                'popularity': 'high',
                'relevance_score': 4.7
            },
            {
                'id': 3,
                'name': 'Coursera',
                'description': 'Online courses from top universities and companies',
                'type': 'course',
                'url': 'https://coursera.org',
                'difficulty': 'intermediate',
                'pricing': 'freemium',
                'rating': 4.6,
                'tags': ['university', 'certification', 'professional'],
                'popularity': 'high',
                'relevance_score': 4.6
            },
            {
                'id': 4,
                'name': 'Stack Overflow',
                'description': 'Q&A platform for programmers and developers',
                'type': 'website',
                'url': 'https://stackoverflow.com',
                'difficulty': 'intermediate',
                'pricing': 'free',
                'rating': 4.5,
                'tags': ['programming', 'Q&A', 'community'],
                'popularity': 'high',
                'relevance_score': 4.5
            },
            {
                'id': 5,
                'name': 'Traversy Media',
                'description': 'Web development tutorials and crash courses',
                'type': 'youtube',
                'url': 'https://youtube.com/c/TraversyMedia',
                'difficulty': 'beginner',
                'pricing': 'free',
                'rating': 4.6,
                'tags': ['web-development', 'tutorials', 'javascript'],
                'popularity': 'high',
                'relevance_score': 4.6
            },
            {
                'id': 6,
                'name': 'MDN Web Docs',
                'description': 'Comprehensive web development documentation',
                'type': 'website',
                'url': 'https://developer.mozilla.org',
                'difficulty': 'intermediate',
                'pricing': 'free',
                'rating': 4.8,
                'tags': ['documentation', 'web-development', 'reference'],
                'popularity': 'high',
                'relevance_score': 4.8
            },
            {
                'id': 7,
                'name': 'Codecademy',
                'description': 'Interactive coding lessons and projects',
                'type': 'course',
                'url': 'https://codecademy.com',
                'difficulty': 'beginner',
                'pricing': 'freemium',
                'rating': 4.4,
                'tags': ['interactive', 'programming', 'projects'],
                'popularity': 'high',
                'relevance_score': 4.4
            },
            {
                'id': 8,
                'name': 'Khan Academy',
                'description': 'Free educational content for all subjects',
                'type': 'course',
                'url': 'https://khanacademy.org',
                'difficulty': 'beginner',
                'pricing': 'free',
                'rating': 4.5,
                'tags': ['education', 'free', 'comprehensive'],
                'popularity': 'high',
                'relevance_score': 4.5
            }
        ]
        
        # Filter results based on query and filters
        filtered_results = []
        query_lower = query.lower()
        
        for resource in fallback_resources:
            # Simple relevance check
            resource_text = f"{resource['name']} {resource['description']}".lower()
            if any(word in resource_text for word in query_lower.split()):
                filtered_results.append(resource)
        
        # If no matches, return all fallback results
        if not filtered_results:
            filtered_results = fallback_resources
        
        return filtered_results[:8]  # Return max 8 results 