import re
from typing import List

def validate_email(email: str) -> bool:
    """
    Validate email format using regex.
    
    Args:
        email: Email address to validate
        
    Returns:
        bool: True if email is valid, False otherwise
    """
    if not email or not isinstance(email, str):
        return False
    
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_pattern, email.strip()) is not None

def validate_password(password: str) -> List[str]:
    """
    Validate password strength and return list of errors.
    
    Args:
        password: Password to validate
        
    Returns:
        List[str]: List of validation error messages
    """
    errors = []
    
    if not password or not isinstance(password, str):
        errors.append("Password is required")
        return errors
    
    # Minimum length check
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")
    
    # Maximum length check
    if len(password) > 128:
        errors.append("Password must be less than 128 characters long")
    
    # Character type checks
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")
    
    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")
    
    if not re.search(r'\d', password):
        errors.append("Password must contain at least one number")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("Password must contain at least one special character")
    
    # Common password check
    common_passwords = [
        'password', '123456', '123456789', 'qwerty', 'abc123',
        'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ]
    
    if password.lower() in common_passwords:
        errors.append("Please choose a stronger password")
    
    return errors

def validate_name(name: str) -> bool:
    """
    Validate name format.
    
    Args:
        name: Name to validate
        
    Returns:
        bool: True if name is valid, False otherwise
    """
    if not name or not isinstance(name, str):
        return False
    
    name = name.strip()
    
    # Check length
    if len(name) < 1 or len(name) > 100:
        return False
    
    # Check for valid characters (letters, spaces, hyphens, apostrophes)
    name_pattern = r"^[a-zA-Z\s\-']+$"
    return re.match(name_pattern, name) is not None

def validate_search_query(query: str) -> List[str]:
    """
    Validate search query.
    
    Args:
        query: Search query to validate
        
    Returns:
        List[str]: List of validation error messages
    """
    errors = []
    
    if not query or not isinstance(query, str):
        errors.append("Search query is required")
        return errors
    
    query = query.strip()
    
    # Check length
    if len(query) < 1:
        errors.append("Search query cannot be empty")
    elif len(query) > 500:
        errors.append("Search query is too long (maximum 500 characters)")
    
    # Check for potentially harmful content
    harmful_patterns = [
        r'<script',
        r'javascript:',
        r'on\w+\s*=',
        r'eval\s*\(',
        r'document\.',
        r'window\.'
    ]
    
    for pattern in harmful_patterns:
        if re.search(pattern, query, re.IGNORECASE):
            errors.append("Search query contains invalid content")
            break
    
    return errors

def validate_url(url: str) -> bool:
    """
    Validate URL format.
    
    Args:
        url: URL to validate
        
    Returns:
        bool: True if URL is valid, False otherwise
    """
    if not url or not isinstance(url, str):
        return False
    
    url_pattern = r'^https?://(?:[-\w.])+(?:[:\d]+)?(?:/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:#(?:\w*))?)?$'
    return re.match(url_pattern, url.strip()) is not None

def sanitize_input(input_text: str, max_length: int = 1000) -> str:
    """
    Sanitize user input by removing potentially harmful content.
    
    Args:
        input_text: Text to sanitize
        max_length: Maximum allowed length
        
    Returns:
        str: Sanitized text
    """
    if not input_text or not isinstance(input_text, str):
        return ""
    
    # Strip whitespace and limit length
    sanitized = input_text.strip()[:max_length]
    
    # Remove HTML tags
    sanitized = re.sub(r'<[^>]+>', '', sanitized)
    
    # Remove script content
    sanitized = re.sub(r'<script.*?</script>', '', sanitized, flags=re.IGNORECASE | re.DOTALL)
    
    # Remove javascript: URLs
    sanitized = re.sub(r'javascript:', '', sanitized, flags=re.IGNORECASE)
    
    return sanitized 