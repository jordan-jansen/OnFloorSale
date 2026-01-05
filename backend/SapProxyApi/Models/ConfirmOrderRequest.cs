namespace SapProxyApi.Models
{
    public class ConfirmOrderRequest
    {
        public string OrderId { get; set; } = string.Empty;
        public string StoreId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public List<ConfirmOrderItem> Items { get; set; } = new();
    }

    public class ConfirmOrderItem
    {
        public string Barcode { get; set; } = string.Empty;
        public string ItemNo { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal UnitPriceIncVAT { get; set; }
        public int Quantity { get; set; }
    }
}
