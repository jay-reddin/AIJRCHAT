import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/utils/auth/useAuth';
import { useChat } from '@/hooks/useChat';
import { 
  Send, 
  MessageCircle, 
  User, 
  Eye,
  Zap,
  Brain,
  Plus,
  ChevronDown,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react-native';
import KeyboardAvoidingAnimatedView from '@/components/KeyboardAvoidingAnimatedView';

const THEME_COLORS = {
  light: {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F3F4',
    text: '#000000',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    border: '#E5E7EB',
    primary: '#2563EB',
    primaryText: '#FFFFFF',
    userBubble: '#2563EB',
    userBubbleText: '#FFFFFF',
    aiBubble: '#F1F3F4',
    aiBubbleText: '#000000',
    inputBackground: '#FFFFFF',
    inputBorder: '#E5E7EB',
    headerBackground: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    background: '#0E0E10',
    surface: '#1B1B1E',
    surfaceSecondary: '#2A2A2E',
    text: '#FFFFFF',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    border: '#374151',
    primary: '#3B82F6',
    primaryText: '#FFFFFF',
    userBubble: '#3B82F6',
    userBubbleText: '#FFFFFF',
    aiBubble: '#2A2A2E',
    aiBubbleText: '#FFFFFF',
    inputBackground: '#1B1B1E',
    inputBorder: '#374151',
    headerBackground: '#1B1B1E',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

const AI_MODELS = [
  { id: 'gpt-5', name: 'GPT-5', provider: 'OpenAI', capabilities: ['functions', 'streaming'] },
  { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', capabilities: ['functions', 'streaming', 'vision'] },
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash', provider: 'Google', capabilities: ['functions', 'streaming', 'vision'] },
  { id: 'deepseek-chat', name: 'DeepSeek Chat', provider: 'DeepSeek', capabilities: ['functions', 'streaming'] },
  { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', provider: 'DeepSeek', capabilities: ['reasoning', 'streaming'] },
  { id: 'meta-llama/llama-4-maverick', name: 'Llama 4 Maverick', provider: 'Meta', capabilities: ['functions', 'streaming'] },
  { id: 'qwen/qwen3-coder', name: 'Qwen3 Coder', provider: 'Qwen', capabilities: ['functions', 'streaming'] },
];

const CapabilityIcon = ({ capability, colors, size = 16 }) => {
  switch (capability) {
    case 'functions':
      return <Zap size={size} color={colors.primary} />;
    case 'vision':
      return <Eye size={size} color={colors.primary} />;
    case 'reasoning':
      return <Brain size={size} color={colors.primary} />;
    default:
      return null;
  }
};

const Message = ({ message, colors, isUser }) => {
  return (
    <View style={{
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      maxWidth: '80%',
      marginVertical: 4,
      marginHorizontal: 16,
    }}>
      <View style={{
        backgroundColor: isUser ? colors.userBubble : colors.aiBubble,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderBottomLeftRadius: isUser ? 20 : 4,
        borderBottomRightRadius: isUser ? 4 : 20,
      }}>
        <Text style={{
          color: isUser ? colors.userBubbleText : colors.aiBubbleText,
          fontSize: 16,
          lineHeight: 22,
        }}>
          {message.content}
        </Text>
      </View>
      <Text style={{
        color: colors.textMuted,
        fontSize: 12,
        marginTop: 4,
        marginLeft: isUser ? 0 : 8,
        marginRight: isUser ? 8 : 0,
        textAlign: isUser ? 'right' : 'left',
      }}>
        {new Date(message.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </View>
  );
};

const ModelSelector = ({ selectedModel, onModelSelect, colors, visible, onClose }) => {
  if (!visible) return null;

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <View style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
      }}>
        <Text style={{
          color: colors.text,
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          Select AI Model
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {AI_MODELS.map((model) => (
            <TouchableOpacity
              key={model.id}
              onPress={() => {
                onModelSelect(model.id);
                onClose();
              }}
              style={{
                padding: 16,
                borderRadius: 12,
                marginBottom: 8,
                backgroundColor: selectedModel === model.id ? colors.primary + '20' : colors.surfaceSecondary,
                borderWidth: selectedModel === model.id ? 2 : 1,
                borderColor: selectedModel === model.id ? colors.primary : colors.border,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                    {model.name}
                  </Text>
                  <Text style={{
                    color: colors.textSecondary,
                    fontSize: 14,
                    marginTop: 2,
                  }}>
                    {model.provider}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {model.capabilities.map((capability) => (
                    <CapabilityIcon
                      key={capability}
                      capability={capability}
                      colors={colors}
                      size={18}
                    />
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <TouchableOpacity
          onPress={onClose}
          style={{
            backgroundColor: colors.primary,
            padding: 16,
            borderRadius: 12,
            marginTop: 16,
          }}
        >
          <Text style={{
            color: colors.primaryText,
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
          }}>
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const UserMenu = ({ visible, onClose, onSignOut, onToggleTheme, isDarkMode, colors, user }) => {
  if (!visible) return null;

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <View style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        width: '80%',
      }}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <User size={30} color={colors.primaryText} />
          </View>
          <Text style={{
            color: colors.text,
            fontSize: 18,
            fontWeight: 'bold',
          }}>
            {user?.username || 'User'}
          </Text>
          {user?.email && (
            <Text style={{
              color: colors.textSecondary,
              fontSize: 14,
              marginTop: 4,
            }}>
              {user.email}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={onToggleTheme}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderRadius: 12,
            backgroundColor: colors.surfaceSecondary,
            marginBottom: 12,
          }}
        >
          {isDarkMode ? (
            <Sun size={20} color={colors.text} />
          ) : (
            <Moon size={20} color={colors.text} />
          )}
          <Text style={{
            color: colors.text,
            fontSize: 16,
            marginLeft: 12,
            flex: 1,
          }}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            onClose();
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: onSignOut },
              ]
            );
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderRadius: 12,
            backgroundColor: '#EF444420',
            marginBottom: 16,
          }}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={{
            color: '#EF4444',
            fontSize: 16,
            marginLeft: 12,
            flex: 1,
          }}>
            Sign Out
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onClose}
          style={{
            backgroundColor: colors.primary,
            padding: 16,
            borderRadius: 12,
          }}
        >
          <Text style={{
            color: colors.primaryText,
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
          }}>
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function MobileAIChat() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { messages, isLoading, sendMessage, clearMessages } = useChat();
  
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedModel, setSelectedModel] = useState('gpt-5');
  const [message, setMessage] = useState('');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const colors = THEME_COLORS[isDarkMode ? 'dark' : 'light'];
  const flatListRef = useRef(null);

  const selectedModelInfo = AI_MODELS.find(m => m.id === selectedModel);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    const messageText = message;
    setMessage('');
    await sendMessage(messageText, selectedModel);
  };

  const handleNewChat = () => {
    clearMessages();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  if (!user) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
      }}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <MessageCircle size={60} color={colors.primary} />
        <Text style={{
          color: colors.text,
          fontSize: 24,
          fontWeight: 'bold',
          marginTop: 20,
          textAlign: 'center',
        }}>
          AI Chat Mobile
        </Text>
        <Text style={{
          color: colors.textSecondary,
          fontSize: 16,
          marginTop: 8,
          textAlign: 'center',
        }}>
          Please sign in to continue
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingAnimatedView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
      }}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: colors.headerBackground,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}>
          <TouchableOpacity onPress={handleNewChat}>
            <Plus size={24} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setShowModelSelector(true)}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 16,
            }}
          >
            <Text style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: '600',
            }}>
              {selectedModelInfo?.name || 'Select Model'}
            </Text>
            <ChevronDown size={20} color={colors.textSecondary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setShowUserMenu(true)}>
            <User size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Message
              message={item}
              colors={colors}
              isUser={item.role === 'user'}
            />
          )}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Loading indicator */}
        {isLoading && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
            <View style={{
              alignSelf: 'flex-start',
              backgroundColor: colors.aiBubble,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 20,
              borderBottomLeftRadius: 4,
            }}>
              <Text style={{
                color: colors.aiBubbleText,
                fontSize: 16,
              }}>
                Thinking...
              </Text>
            </View>
          </View>
        )}

        {/* Input Area */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingBottom: Math.max(insets.bottom, 12),
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={4000}
            style={{
              flex: 1,
              backgroundColor: colors.inputBackground,
              borderWidth: 1,
              borderColor: colors.inputBorder,
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginRight: 12,
              color: colors.text,
              fontSize: 16,
              maxHeight: 120,
            }}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!message.trim() || isLoading}
            style={{
              backgroundColor: (!message.trim() || isLoading) ? colors.border : colors.primary,
              width: 44,
              height: 44,
              borderRadius: 22,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Send size={20} color={colors.primaryText} />
          </TouchableOpacity>
        </View>

        {/* Modals */}
        <ModelSelector
          selectedModel={selectedModel}
          onModelSelect={setSelectedModel}
          colors={colors}
          visible={showModelSelector}
          onClose={() => setShowModelSelector(false)}
        />

        <UserMenu
          visible={showUserMenu}
          onClose={() => setShowUserMenu(false)}
          onSignOut={handleSignOut}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          isDarkMode={isDarkMode}
          colors={colors}
          user={user}
        />
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}