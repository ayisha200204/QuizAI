import re

def split_transcript(transcript, min_words=150, max_words=400):
    """
    Split transcript into meaningful segments.
    Uses sentence boundaries but falls back to word-count chunks if sentences are too long or missing.
    """
    # 1. First, split by sentence-ending punctuation
    raw_sentences = re.split(r'(?<=[.!?])\s+', transcript)
    
    # 2. Refine: If a "sentence" is too long (no punctuation), break it by word count
    sentences = []
    for s in raw_sentences:
        words = s.split()
        if len(words) > max_words * 1.5:
            # Break this long block into pseudo-sentences
            for i in range(0, len(words), max_words):
                sentences.append(" ".join(words[i:i + max_words]))
        else:
            sentences.append(s)

    segments = []
    current_segment = []
    current_word_count = 0
    
    for sentence in sentences:
        words = sentence.split()
        sentence_word_count = len(words)
        
        if not words:
            continue
            
        if current_word_count + sentence_word_count > max_words and current_word_count >= min_words:
            segments.append(" ".join(current_segment))
            current_segment = []
            current_word_count = 0
            
        current_segment.append(sentence)
        current_word_count += sentence_word_count
        
    if current_segment:
        segments.append(" ".join(current_segment))
        
    return segments

def score_segment(text):
    """
    Score segment based on information density, keyword presence, and structure.
    """
    score = 0
    text_lower = text.lower()
    words = text_lower.split()
    word_count = len(words)
    
    if word_count == 0:
        return 0

    # 1. Base score for moderate length
    if 150 <= word_count <= 400:
        score += 3
    elif word_count > 400:
        score += 1
        
    # 2. Conceptual Keywords (High Value)
    educational_keywords = [
        "define", "concept", "principle", "theory", "process", "function", 
        "method", "technique", "system", "architecture", "algorithm",
        "example", "specifically", "furthermore", "consequently", "result"
    ]
    for kw in educational_keywords:
        if kw in text_lower:
            score += 1
            
    # 3. Bloom's Taxonomy Indicators
    bloom_indicators = [
        "explain", "how", "why", "compare", "contrast", "apply", 
        "analyze", "evaluate", "create", "design", "solve"
    ]
    for bi in bloom_indicators:
        if bi in text_lower:
            score += 2

    # 4. Information Density (Unique word ratio)
    unique_words = len(set(words))
    density = unique_words / word_count
    if density > 0.5:
        score += 2

    # 5. Penalize Filler/Intro Phrases
    filler_phrases = ["welcome to", "don't forget to", "subscribe", "like and share", "video is about"]
    for fp in filler_phrases:
        if fp in text_lower:
            score -= 2

    return max(0, score)

def is_valid_segment(text):
    """
    Filter out segments that are likely introductions or low-information noise.
    """
    if not text or not isinstance(text, str):
        return False

    text_lower = text.lower()
    word_count = len(text.split())

    # ❌ Too short constraints (Reduced from 80 to 50 to be more inclusive)
    if word_count < 50:
        return False

    # ❌ Strong Intro/Outro signatures
    strong_intro_noise = [
        "welcome back to my channel", "in today's video", "hey guys",
        "let's jump right in", "before we start", "like and subscribe",
        "thanks for watching"
    ]
    
    # Only filter if 3 or more noise phrases are present (relaxed from 2)
    matches = sum(1 for noise in strong_intro_noise if noise in text_lower)
    if matches >= 3: 
        return False

    # ❌ Non-informative fragments (Relaxed density check)
    noise_indicators = ["um", "uh", "you know", "like I said"]
    noise_count = sum(text_lower.count(ni) for ni in noise_indicators)
    if noise_count > word_count * 0.1: # Increased from 0.05
        return False

    # ✅ Looks educational
    return True