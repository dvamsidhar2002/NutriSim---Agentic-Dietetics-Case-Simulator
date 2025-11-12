import google.generativeai as genai
import random

# STEP 1: Replace with your actual API key
GOOGLE_API_KEY = "AIzaSyCMtPQP4hhhiV5_1hkEZIskWtIPxMeFufk"
genai.configure(api_key=GOOGLE_API_KEY)

# STEP 2: Use Gemini 2.0 Flash Model
model = genai.GenerativeModel('gemini-2.0-flash')

# RL Definitions
states = ["easy", "medium", "hard"]
actions = ["easier", "same", "harder"]
Q = {state: {action: 0 for action in actions} for state in states}
alpha = 0.5
gamma = 0.9
epsilon = 0.1

def update_q_table(state, action, reward, next_state):
    max_future_q = max(Q[next_state].values())
    current_q = Q[state][action]
    new_q = current_q + alpha * (reward + gamma * max_future_q - current_q)
    Q[state][action] = new_q

def choose_action(state):
    if random.uniform(0, 1) < epsilon:
        return random.choice(actions)
    return max(Q[state], key=Q[state].get)

def adjust_prompt_by_difficulty(state, action):
    next_state = state
    if state == "easy":
        if action == "harder":
            next_state = "medium"
    elif state == "medium":
        if action == "harder":
            next_state = "hard"
        elif action == "easier":
            next_state = "easy"
    elif state == "hard":
        if action == "easier":
            next_state = "medium"
    return next_state

def get_prompt_for_difficulty(level):
    base_prompt = """
You are a clinical dietetics case simulator. Generate a realistic clinical case for a nutrition student to solve.

Include:
- Age, gender, medical condition
- Symptoms, lifestyle, lab values
- Weight, height, BMI

Do NOT mention "difficulty" in your response.
"""
    if level == "easy":
        return base_prompt + "\nKeep the case straightforward with common conditions like obesity or Type 2 Diabetes."
    elif level == "medium":
        return base_prompt + "\nInclude comorbidities like Type 2 Diabetes + Hypertension or Hyperlipidemia."
    elif level == "hard":
        return base_prompt + "\nAdd rare or complex issues like CKD Stage 3, Metabolic Syndrome, or combined multiple organ impact."
    return base_prompt

# Initial state
current_state = "easy"

# Simulated response (replace this with actual user feedback)
user_correct = True  # or False depending on user answer
reward = 1 if user_correct else -1

# RL loop
action = choose_action(current_state)
next_state = adjust_prompt_by_difficulty(current_state, action)
update_q_table(current_state, action, reward, next_state)
new_prompt = get_prompt_for_difficulty(next_state)
response = model.generate_content(new_prompt)

# Update current state
current_state = next_state

# Output result
print("\nGenerated Dietetics Case:\n")
print(response.text.strip())