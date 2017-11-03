package testFaceCast;

import static org.junit.Assert.*;

import java.io.UnsupportedEncodingException;

import org.apache.http.entity.StringEntity;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Before;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

import org.junit.Test;

public class TestApp {
	JsonNode body;
	HttpResponse<JsonNode> response;
	HttpResponse<JsonNode> responseFigurant;

	@Before
	public void setUp() throws UnirestException {

		response = Unirest.get("http://localhost:3000/rest/candidature").asJson();
		body = response.getBody();
		responseFigurant = Unirest.get("http://localhost:3000/rest/figurant").asJson();
		
	}

	@Test
	public void testStatut() {

		assertNotNull(response);
		assertEquals("enAttente", body.getArray().getJSONObject(0).getString("statut"));
	}

	@Test
	public void testIdOffreAndIdFigurant() {

		// Test IdOffre
		assertEquals("59ede93db8b17d0068cc3e23", body.getArray().getJSONObject(0).getString("idOffre"));

		// Test IdFigurant
		assertEquals("59ec70a849a17b4da7e07f27", body.getArray().getJSONObject(0).getString("idFigurant"));

	}

	////////////////////////////////////////////////////////////

	@Test
	public void ajoutCandidature() {

		try {
			HttpResponse<JsonNode> requestCandidature = Unirest.post("http://localhost:3000/rest/candidature")
					.header("accept", "application/json").field("statut", "EnAttente")
					.field("idFigurant", "59ec6fdf49a17b4da7e07ec5").field("idOffre", "59ede93db8b17d0068cc3e23")
					.asJson();
			assertEquals(200, requestCandidature.getStatus());
			assertEquals(8, response.getBody().getArray().length());

		} catch (UnirestException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			fail("erreur d'ajout de candidature");
		}
	}

	@Test
	public void inscriptionFigurant() {
		try {
			HttpResponse<JsonNode> requestFigurant = Unirest.post("http://localhost:3000/rest/figurant")
					.header("accept", "application/json").field("nom", "Test").field("prenom", "Test").field("age", 20)
					.field("sexe", 'M').field("role", "Testeur").asJson();

			assertEquals(200, requestFigurant.getStatus());
			assertEquals(25, responseFigurant.getBody().getArray().length());

		} catch (UnirestException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			fail("Erreur d'inscription d'un figurant");
		}

	}

	@Test
	public void mesCandidatures() {
		try {
			HttpResponse<JsonNode> responseCandidature = Unirest
					.get("http://localhost:3000/rest/candidature/59ec70a849a17b4da7e07f27").asJson();
			assertEquals(2, responseCandidature.getBody().getArray().length());
		} catch (UnirestException e) {
			// TODO Auto-generated catch block
			fail("Erreur : nombre d'object dans le json");
			e.printStackTrace();
		}

	}

}
