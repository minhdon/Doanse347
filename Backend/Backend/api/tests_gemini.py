from django.test import TestCase
from rest_framework.test import APIClient
from unittest.mock import patch, Mock


class GeminiChatTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    @patch('api.views.embedding_model')
    @patch('api.views.gemini_model')
    def test_chatbot_recommend_success(self, mock_gemini_model, mock_embedding_model):
        # Arrange: fake embedding and drug data
        mock_embedding_model.encode.return_value = [0.1, 0.2, 0.3]
        fake_drug = {
            'productName': 'TestDrug',
            'productDesc': 'Used for testing',
            'embedding': [0.1, 0.2, 0.3]
        }
        with patch('api.views.DRUGS_DATA', [fake_drug]):
            # Mock Gemini response object
            fake_response = Mock()
            fake_response.text = 'This is a fake Gemini reply.'
            mock_gemini_model.generate_content.return_value = fake_response

            # Act
            resp = self.client.post('/chat/', {'message': 'headache'}, format='json')

            # Assert
            self.assertEqual(resp.status_code, 200)
            self.assertIn('reply', resp.data)
            self.assertEqual(resp.data['reply'], fake_response.text)
            self.assertIn('recommended_drugs', resp.data)
            self.assertTrue(len(resp.data['recommended_drugs']) >= 1)

    @patch('api.views.embedding_model')
    @patch('api.views.gemini_model')
    def test_chatbot_recommend_gemini_error(self, mock_gemini_model, mock_embedding_model):
        # Arrange: ensure some data exists
        mock_embedding_model.encode.return_value = [0.1, 0.2, 0.3]
        fake_drug = {
            'productName': 'TestDrug',
            'productDesc': 'Used for testing',
            'embedding': [0.1, 0.2, 0.3]
        }
        with patch('api.views.DRUGS_DATA', [fake_drug]):
            # Make Gemini raise
            mock_gemini_model.generate_content.side_effect = Exception('API down')

            # Act
            resp = self.client.post('/chat/', {'message': 'fever'}, format='json')

            # Assert
            self.assertEqual(resp.status_code, 500)
            self.assertIn('reply', resp.data)
            self.assertIn('error_type', resp.data)
