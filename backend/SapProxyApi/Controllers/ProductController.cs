using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text;
using System.Xml.Linq;

namespace SapProxyApi.Controllers;

[ApiController]
[Route("api/product")]
public class ProductController : ControllerBase
{
    [HttpPost("by-barcode")]
    public async Task<IActionResult> GetByBarcode([FromBody] BarcodeRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Barcode))
            return BadRequest("Barcode is required");

        // 1️⃣ Build SOAP request (matches Postman exactly)
        var soapXml = $@"
<Envelope xmlns=""http://schemas.xmlsoap.org/soap/envelope/"">
  <Body>
    <GetItemDetailsSAP xmlns=""urn:microsoft-dynamics-schemas/codeunit/SAPFloorOrder_Mgt"">
      <pGetItemDetailsRequest>
        <Item xmlns=""urn:microsoft-dynamics-nav/xmlports/x50108"">
          <storeID>1W7</storeID>
          <barcodeNo>{req.Barcode}</barcodeNo>
          <itemNo></itemNo>
          <description></description>
          <unitPriceIncVAT></unitPriceIncVAT>
        </Item>
      </pGetItemDetailsRequest>
    </GetItemDetailsSAP>
  </Body>
</Envelope>";

        // 2️⃣ NTLM auth
        var handler = new HttpClientHandler
        {
            Credentials = new NetworkCredential(
                "gagroup\\navservices",
                "G@gNav!@134%"
            ),
            UseDefaultCredentials = false
        };

        using var client = new HttpClient(handler);

        var content = new StringContent(soapXml, Encoding.UTF8, "text/xml");
        content.Headers.Add(
            "SOAPAction",
            "urn:microsoft-dynamics-schemas/codeunit/SAPFloorOrder_Mgt:GetItemDetailsSAP"
        );

        // 3️⃣ Call SAP
        var response = await client.PostAsync(
            "http://20.74.231.80:7002/ELEVATE_LS_SIT/WS/Grandiose%20Stores/Codeunit/SAPFloorOrder_Mgt",
            content
        );

        var xml = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            return StatusCode(500, xml);

        // 4️⃣ Parse SOAP XML
        var doc = XDocument.Parse(xml);

        XNamespace soap = "http://schemas.xmlsoap.org/soap/envelope/";
        XNamespace nav = "urn:microsoft-dynamics-nav/xmlports/x50108";

        var item = doc
            .Descendants(nav + "Item")
            .FirstOrDefault();

        if (item == null)
            return NotFound("Product not found");

        // 5️⃣ Return CLEAN JSON to frontend
        return Ok(new
        {
            barcode = item.Element(nav + "barcodeNo")?.Value,
            itemNo = item.Element(nav + "itemNo")?.Value,
            description = item.Element(nav + "description")?.Value,
            price = decimal.TryParse(
                item.Element(nav + "unitPriceIncVAT")?.Value,
                out var p
            ) ? p : 0
        });
    }
}

public class BarcodeRequest
{
    public string Barcode { get; set; } = "";
}
